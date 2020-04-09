import React, { useState, useRef } from 'react';
import {Button, Grid, Header} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setComponent} from "../actions/component";
import MainMenu from "./MainMenu";
import {getRandomElementFromArray, getRandomInt} from "../util/util";
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
//import csound from "csound-wasm";
//import CsoundObj from "csound"
//import {Csound} from "csound-wasm-test/src/wasm/Csound"
import {Helmet} from "react-helmet";



const AskIntonation = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const name = useSelector(state => state.exerciseReducer.name);
    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [possibleChords, setPossibleChords] = useState([]);
    const [selectedChord, setSelectedChord] = useState([]);
    const [answer, setAnswer] = useState(null);


    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);
        // what is right place for setting the volume?

        switch(name) {
            case "a":

                break;
            case "b":

                break;
            default:
                console.log("no exercise found");
                return;
        }

        //setPossibleChords(possibleChords);
        csoundTest();

        renew();


    };


    const csoundTest = () => {
        const csound = window.csound; //new CsoundObj();  //require('csound-wasm');
        console.log("Csound type: ", typeof(csound));
        if (typeof (csound)==="undefined") {
            console.log("Csound ins undefined");
            return;
        }



        const beeper = `
instr 1
  asig = poscil:a(0.3, 440)
  outc asig, asig
endin`;

        const makeBeep = `i 1 0 2`;

        csound.startRealtime();
        csound.compileOrc(beeper);
        console.log("dbfs: ", csound.get0dbfs());
        csound.readScore(makeBeep);

        //setTimeout(() => process.exit(), 5000);

    };

    // renew generates answer and performs play/show
    const renew = () =>  {
        //const midiNote = getRandomInt(53, 72); // TODO: make the range configurable
        //setBaseMidiNote(midiNote);
        //const selectedChord = getRandomElementFromArray(possibleChords);
        //setSelectedChord(selectedChord);
        //console.log("Selected chord: ", t(selectedChord.longName), baseMidiNote, midiNote );
        const answer = {shortName: selectedChord.shortName}; // may be different in different exercised, might need switch/case
        setAnswer(answer);
        const interval = 1.5, deviation = -30;
        play(interval, deviation);
    };

    // what is more generic name -  perform? execute? present?
    const play = (interval, deviation) => {
        const duration = 4; // TODO: make configurable
        csoundTest();

    };

    const checkResponse = (response) => { // response is an object {key: value [, key2: value, ...]}
        //console.log(response);
        //const correctChord = t(selectedChord.longName); // TODO: translation

        if ( JSON.stringify(response) === JSON.stringify(answer)) {
            dispatch(setPositiveMessage(`${t("correctAnswerIs")} ${"Mingi vastus"}`, 5000));
        } else {
            dispatch(setNegativeMessage(`${t("correctAnswerIs")} ${"Mingi vastus"
            }`, 5000));
        }
    };


    // UI ======================================================

    const goBack = () => {
        dispatch(setComponent("MainMenu"));
    };

    const createPlaySoundButton = () => {
        console.log("Begun: ", exerciseHasBegun);
        // console.log("Begun: ", exerciseHasBegun());
        // if (exerciseHasBegun()) {
        if (exerciseHasBegun) {
            return (
                <Grid.Row  columns={2} centered={true}>
                    <Grid.Column>
                        <Button color={"green"} onClick={() => renew(possibleChords)} className={"fullWidth marginTopSmall"} >{t("playNext")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button /*onClick={() => play(selectedChord, baseMidiNote)}*/ className={"fullWidth marginTopSmall"}  >{t("repeat")}</Button>
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

    const createResponseButtons = () => {
        let rows = [];

        for (let i = 0, n = possibleChords.length; i < n; i += 2) {
            const row = createResponseButtonRow(possibleChords[i], possibleChords[i + 1]);
            rows.push(row);
        }

        return rows;
    };

    const createResponseButtonRow = (chord1, chord2) => {
        return (
            <Grid.Row columns={2}>
                {createResponseButtonColumn(chord1)}
                {createResponseButtonColumn(chord2)}
            </Grid.Row>
        )
    };

    const createResponseButtonColumn = (chord) => {
        return (
            <Grid.Column>
                <Button className={"exerciseBtn"}
                        onClick={() => checkResponse({shortName: chord.shortName})}>{t(chord.longName)}</Button>
            </Grid.Column>
        )
    };


    return (
        <div>
            <Helmet>
                <script src="https://github.com/hlolli/csound-wasm/releases/download/6.12.0-5/csound-wasm-browser.js">
                </script>
            </Helmet>
            <Header size='large'>{`${t(name)} `}</Header>
            <Grid>
                {createResponseButtons()}

                {createPlaySoundButton()}
                <Grid.Row>
                    <Grid.Column>

                        <Button onClick={goBack} className={"fullWidth marginTopSmall"}>{t("goBack")}</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>

    );
};

export default AskIntonation;