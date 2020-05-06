import React, { useState, useRef } from 'react';
import {Button, Checkbox, DropdownMenu, Grid, Header, Input} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {getRandomElementFromArray, getRandomBoolean, capitalizeFirst} from "../util/util";
//import {makeVexTabChord} from "../util/intervals";
import {getNoteByName, parseLilypondString} from "../util/notes";
//import MIDISounds from 'midi-sounds-react';
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import ScoreRow from "./ScoreRow";
import Notation from "./Notation";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import Sound from 'react-sound';
import Select from "semantic-ui-react/dist/commonjs/addons/Select";


const AskDictation = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const name = useSelector(state => state.exerciseReducer.name);
    //const midiSounds = useRef(null);

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [selectedDictation, setSelectedDictation] = useState({title:"1a", soundFile:"http://localhost/1a.mp3"});
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);

    const [notesEnteredByUser, setNotesEnteredByUser] = useState(""); // test
    const [vexTabNotes, setVexTabNotes] = useState(":4 C/4");
    const [notationInfo, setNotationInfo] = useState({  clef:"treble", time: "4/4", vtNotes: ":4 C/4" });
    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED)


    // diktaatide definitsioonid võibolla eraldi failis.
    // kas notatsioon Lilypond või VT? pigem lilypond sest import musicXML-st lihtsam
    // vaja mõelda, milliline oleks diktaadifailide struktuur
    // midagi sellist nagu:
    const dictations = [
        {title: "1a", soundFile: "../digisolf/sounds/dictations/1a.mp3", notation:
        ` \\key d \\major \\time 2/4 
        a8 fis a fis | a4 a |
        g8 fis g a | e2 | 
        `
        },
        {title: "2a", soundFile: "../digisolf/sounds/dictations/2a.mp3", notation:
                `  
        `
        },
        {title: "3c", soundFile: "../digisolf/sounds/dictations//3c.mp3", notation:
                `  
        `
        },
        {title: "4b", soundFile: "../digisolf/sounds/dictations/4b.mp3", notation:
                `  
        `
        },
        {title: "5a", soundFile: "../digisolf/sounds/dictations/5a.mp3", notation:
                `  
        `
        },
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
        //renderNotes();

    };

    // ilmselt selles tüübis ei võta juhuslikult vaid mingi menüü, kust kasutaja saab valida
    // võib mõelda ka juhuslikult moodustamise tüübi peale, aga siis ei saa kasutada vist päris pille
    const renew = (dictationIndex) =>  {

        setAnswered(false);
        const dictation = dictations[0];

        setSelectedDictation(dictation);
//        console.log("Selected chord: ", t(selectedChord.longName), baseNote.midiNote );
        const answer = {notation: selectedDictation.notation};  // võibolla mõtekas vaja võti, helistik ja taktimõõt eralid väljadena
        setAnswer(answer);

        playSoundFile(dictation.soundFile);

    };

    const playSoundFile = (url) => {
        console.log("Play soundfile", url);
        setPlayStatus(Sound.status.PLAYING);
    };

    const stop = () => {
        console.log("Stop");
        setPlayStatus(Sound.status.STOPPED);
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
                        <Button color={"green"} onClick={() => playSoundFile(selectedDictation.soundFile)} className={"fullWidth marginTopSmall"} >
                            { capitalizeFirst( t("play")) }
                        </Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => stop()} className={"fullWidth marginTopSmall"}  >{ capitalizeFirst( t("stop") )}</Button>
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

    const createNotationBlock = () => {
        return (
        <div>
            <Input
                onChange={e => {setNotesEnteredByUser(e.target.value)}}
                onKeyPress={ e=> { if (e.key === 'Enter') renderNotes()  }}
                placeholder={'nt: a c2 es2'}
                value={notesEnteredByUser}
            />
            <Button onClick={renderNotes}>{ capitalizeFirst( t("render") )}</Button>
            <Notation  className={"marginTopSmall"} width={600} scale={1}
                       notes={notationInfo.vtNotes}
                       time={notationInfo.time}
                       clef={notationInfo.clef}
                       keySignature={notationInfo.keySignature}/>
        </div>
        );
    };

    const createSelectionMenu = () => {
        const options = []; //"[";
        for (let i=0; i< dictations.length; i++) {
            options.push( { value: i, text: dictations[i].title  } );
        }

        return (
            <Grid.Row>
                <Grid.Column>
            <Select
                className={"marginTopSmall fullwidth"}
                placeholder={"Please choose a dictation"}
                options={options}
                defaultValue={options[0].soundFile}
                onChange={ (e, {value}) => setSelectedDictation(dictations[value]) }
            />
                </Grid.Column>
            </Grid.Row>
        );

    } ;


    const renderNotes = () => {
        const notationInfo = parseLilypondString(notesEnteredByUser);//  noteStringToVexTabChord(notesEnteredByUser);
        setNotationInfo(notationInfo);
        //setVexTabNotes(notationInfo.vtNotes);
    };

    return (
        <div>
            <Header size='large'>{ selectedDictation.title }</Header>

            <Sound
                url={selectedDictation.soundFile}
                loop={false}
                playStatus={playStatus}
            />
            <Grid>
                <ScoreRow/>
                {createSelectionMenu()}
                {createNotationBlock()}
                {createPlaySoundButton()}
                <Grid.Column>
                    <Button className={"fullwidth marginTopSmall"}
                            onClick={() => checkResponse({userInput:"c d e" })}>{ "Valmis"}
                    </Button>
                </Grid.Column>
                <Grid.Row>
                    <Grid.Column>
                        <GoBackToMainMenuBtn/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>

    );
};

export default AskDictation;