import React, { useState, useRef } from 'react';
import {Button, Checkbox, Grid, Header, Input} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {getRandomElementFromArray, getRandomBoolean, capitalizeFirst} from "../util/util";
import {chordDefinitions, makeVexTabChord, makeChord} from "../util/intervals";
import {getNoteByName, getNoteByVtNote} from "../util/notes";
//import MIDISounds from 'midi-sounds-react';
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import ScoreRow from "./ScoreRow";
import Notation from "./Notation";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";


const AskDictation = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const name = useSelector(state => state.exerciseReducer.name);
    //const midiSounds = useRef(null);

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [selectedDictation, setSelectedDictation] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);

    const [notesEnteredByUser, setNotesEnteredByUser] = useState(""); // test

    // diktaatide definitsioonid võibolla eraldi failis.
    // kas notatsioon Lilypond või VT? pigem lilypond sest import musicXML-st lihtsam
    // vaja mõelda, milliline oleks diktaadifailide struktuur
    // midagi sellist nagu:
    const dictations = [
        {title: "1", soundFile: "dictations/1.mp3", notation:
        ` \key d \major \time 2/4 
        a8 fis a fis | a4 a |
        g8 fis g a | e2 | 
        `
        }
    ];



    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);



        switch(name) {
            case "simple":
                break;
            case "twoVoiced":

                break;
            default:
                console.log("no exercise found");
                return;
        }

        // võibolla: setDictationType?
        //const dictationIndex = -1;
        //renew(dictationIndex);

    };

    // ilmselt selles tüübis ei võta juhuslikult vaid mingi menüü, kust kasutaja saab valida
    // võib mõelda ka juhuslikult moodustamise tüübi peale, aga siis ei saa kasutada vist päris pille
    const renew = (dictationIndex) =>  {

        setAnswered(false);
        const dictation = dictations[dictationIndex];

        setSelectedDictation(dictation);
//        console.log("Selected chord: ", t(selectedChord.longName), baseNote.midiNote );
        const answer = {notation: selectedDictation.notation};  // võibolla mõtekas vaja võti, helistik ja taktimõõt eralid väljadena
        setAnswer(answer);

        playSoundFile(dictation)

    };

    const playSoundFile = (url) => {
        return;
    };

    const checkNotation = () => {
        // show correct notation next to entered notation

        let correct = false;
        //console.log("User eneter notes: ", );
        // check, analyze, give feedback
        return correct;
    }

    const checkResponse = (response) => { // response is an object {key: value [, key2: value, ...]}

        if (!exerciseHasBegun) {
            alert(t("pressStartExsercise"));
            return;
        }

        if (answered) {
            alert(t("alreadyAnswered"));
            return;
        }

        setAnswered(true);
        let feedBack = "";
        let correct = true;

        //console.log(response);

        if (checkNotation()) {
            feedBack += `${capitalizeFirst(t("notation"))} ${t("correct")}. `;
            correct = true;
        } else {
            feedBack += capitalizeFirst(t("notation")) + " " + t("wrong") + ". ";
            correct = false;
        }

        if ( correct ) {
            dispatch(setPositiveMessage(feedBack, 5000));
            dispatch(incrementCorrectAnswers());
        } else {
            dispatch(setNegativeMessage(feedBack, 5000));
            dispatch(incrementIncorrectAnswers());
        }
    };





    // UI ======================================================

    const createPlaySoundButton = () => {
        console.log("Begun: ", exerciseHasBegun);

        if (exerciseHasBegun) {
            return (
                <Grid.Row  columns={2} centered={true}>
                    <Grid.Column>
                        <Button color={"green"} onClick={() => renew(0)} className={"fullWidth marginTopSmall"} >{t("playNext")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => play(selectedDictation.soundFile)} className={"fullWidth marginTopSmall"}  >{t("repeat")}</Button>
                    </Grid.Column>
                </Grid.Row>

            );
        } else {
            return(
                <Grid.Row  >
                    <Grid.Column>
                    <Button color={"green"} onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>
                    </Grid.Column>
                </Grid.Row>
            );
        }
    };

    const createResponseButtonColumn = (chord) => {
        return (
            <Grid.Column>
                <Button className={"fullWidth marginTopSmall" /*<- kuvab ok. oli: "exerciseBtn"*/}
                        onClick={() => checkResponse({shortName: chord.shortName})}>{ capitalizeFirst( t(chord.longName) )}</Button>
            </Grid.Column>
        )
    };

    // TEMPORARY -  need rewrite (clef, proper parsing etc)
    const noteStringToVexTabChord =  (noteString) => { // input as c1 es1 ci2 -  will be converted to vextab chord for now
        const noteNames = noteString.trim().split(" ");
        const chordNotes = [];
        for (let name of noteNames) {
            const lastChar = name.charAt(name.length-1);
            if ( !(lastChar >= '0' && lastChar <= '9' ) ) { // if octave number is not set, add 1 for 1st octave ( octave 4 in English system)
                name += '1';
            }
            const note = getNoteByName(name);
            if (note !== undefined) {
                chordNotes.push(note);
            } else {
                console.log("Could not find note according to: ", name)
            }
        }
        if (chordNotes.length>0) {
            return makeVexTabChord(chordNotes);
        } else {
            return "";
        }
    };

    const renderNotes = () => {
         const vexTabString = noteStringToVexTabChord(notesEnteredByUser);
        //dispatch(setUserEnteredNotes(vexTabString));
        setVexTabChord(vexTabString);
    };


    return (
        <div>
            <Header size='large'>{`${t(name)} `}</Header>
            {/*Vaja rida juhiseks (exerciseDescriptio). div selleks ilmselt kehv, sest kattub teistega...*/}
            <div hidden={!useNotation}>
                <div className={"marginTop"}>TEST JUHIS: Sisesta noodid (nt. a c2 e2) ning klõpsa seejärel vasta akordi nupule</div>
                <Input
                    onChange={e => {setNotesEnteredByUser(e.target.value)}}
                    onKeyPress={ e=> { if (e.key === 'Enter') renderNotes()  }}
                    placeholder={'nt: a c2 es2'}
                    value={notesEnteredByUser}
                />
                <Button onClick={renderNotes}>{ capitalizeFirst( t("render") )}</Button>
                <Notation  className={"marginTopSmall"} notes={vexTabChord} width={200} visible={useNotation} /*time={"4/4"} clef={"bass"} keySignature={"A"}*//>
            </div>
            <Grid>
                <Checkbox toggle
                          label={"Noteeri"}
                          defaultChecked={true}
                          className={"/*floatLeft */marginTop"}
                          onChange={ (e, {checked}) => setUseNotation(checked) }
                />
                <ScoreRow/>

                {createPlaySoundButton()}
                <Grid.Column>
                    <Button className={"fullWidth marginTopSmall" /*<- kuvab ok. oli: "exerciseBtn"*/}
                            onClick={() => checkResponse({shortName: chord.shortName})}>{ "Valmis)"}</Button>
                </Grid.Column>
                <Grid.Row>
                    <Grid.Column>

                        <GoBackToMainMenuBtn/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <MIDISounds ref={midiSounds} appElementName="root" instruments={[3]} />
        </div>

    );
};

export default AskChord;