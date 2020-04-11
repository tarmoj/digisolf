import React, { useState, useEffect } from 'react';
import {Button, Grid, Header} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setComponent, setIsLoading} from "../actions/component";
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
    const isHarmonic = useSelector(state => state.exerciseReducer.isHarmonic);
    const cents = useSelector(state => state.exerciseReducer.cents);

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [intervalRatio, setIntervalRatio] = useState(1.5);
    const [answer, setAnswer] = useState(null);
    const [baseMidiNote, setBaseMidiNote] = useState(60);
    const [selectedDeviation, setSelectedDeviation] = useState(0);

    useEffect(() => {
        dispatch(setIsLoading(true));
        const script = document.createElement("script");
        script.src = "https://github.com/hlolli/csound-wasm/releases/download/6.12.0-5/csound-wasm-browser.js";
        script.async = true;
        script.onload = () => dispatch(setIsLoading(false));

        document.body.appendChild(script);
    }, []);

    const possibleDeviations = [5, 10, 20, 30];
    const possibleIntervalRatios = [4/3, 3/2, 2];


    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);

        // csoundStart does not work here. Should wait until csound script is loaded:
        csoundStart();

        renew(cents);
    };



    const csoundStart = () => {
        console.log("*** CSOUND START STARTED ***")
        const csound = window.csound;
        console.log("Csound types: ", typeof(csound), typeof(cs));

        if (typeof(csound) === "undefined") {
            console.log("Csound is not ready yet!");
            return;
        }


        // does not make sense:
        // csound.on("ready", async () => {console.log("Csound is ready now."); });


        const csoundOrchestra = `
giSine ftgen 1,0, 16384, 10, 1 ; Sine
giSawtooth ftgen 2,0,  16384, 10, 1, 0.5, 0.3, 0.25, 0.2, 0.167, 0.14, 0.125, .111   ; Sawtooth
giSquare ftgen 3,  0, 16384, 10, 1, 0,   0.3, 0,    0.2, 0,     0.14, 0,     .111   ; Square

; parameters from p4 -  amp, midinote, intervalRatio, cents, soundtype (1- sine, 2 - saw, 3- square), isMelodic (1|0)
instr PlayInterval
	iAmp = (p4==0) ? 0.3 : p4
	iFreq1 = cpsmidinn(p5) ; pich given as midi note
	iIntervalRatio = p6 ; frequency ratio from base note 1.5 - perfect fifth etc
	iCents = p7 ; deviation in cents, positive or negative 
	iFreq2 = iFreq1 * iIntervalRatio * cent(iCents)
	iSoundType = p8
	iPlayMelodic = p9
	iTable = (iSoundType >0 && iSoundType <=3) ? iSoundType : 1 
	 
	
	iDuration = (iPlayMelodic>0) ? p3/2 : p3
	iStart2 = (iPlayMelodic>0) ? iDuration : 0
	; think how to use samples of instruments
	iInstrument = nstrnum("Beep")
	
	schedule iInstrument, 0, iDuration, iAmp, iFreq1, iTable
	schedule iInstrument, iStart2, iDuration, iAmp, iFreq2,iTable 
endin


instr Beep
	iAmp = p4
	iFreq = p5
	iTable = p6	
	aEnvelope linen iAmp, 0.1, p3, 0.5
	aSignal poscil aEnvelope, iFreq, iTable
	outs aSignal, aSignal
endin

    `;
        csound.get0dbfs().then(
            (value) => {
                console.log("0dbfs value: ", value );
                if (value>1) {  // clumsy way to check if orchestra is compiled
                    console.log("START REALTIME");
                    csound.setOption("-m 0");
                    csound.setOption("-d");
                    csound.startRealtime();
                }
            }
        );

        csound.compileOrc(csoundOrchestra);
        console.log("Compiled Csound code");

    };




    // renew generates answer and performs play/show
    const renew = (cents) =>  {

        const deviationAmount =  (cents === 0) ? getRandomElementFromArray(possibleDeviations) : cents; // the number of cents the interval can be wrong

        const random = Math.random()*3;
        let deviation, intonation;
        if (random < 1) {
            deviation = 0-deviationAmount;
            intonation = "low";
        } else if (random > 2) {
            deviation = deviationAmount;
            intonation = "high";
        } else {
            deviation = 0;
            intonation = "inTune";
        }
        console.log("Deviation: ", deviation, intonation, cents);
        setSelectedDeviation(deviation);
        setAnswer({intonation: intonation});

        const midiNote = getRandomInt(53, 72); // TODO: make the range configurable
        setBaseMidiNote(midiNote);
        const intervalRatio = getRandomElementFromArray(possibleIntervalRatios);
        setIntervalRatio(intervalRatio);

        play(midiNote, intervalRatio, deviation);
    };

    // what is more generic name -  perform? execute? present?
    const play = (midiNote=60, intervalRatio=1.5, deviation=0) => {
        console.log("*** PLAY*** ");
        const duration = 4; // TODO: make configurable
        const csound = window.csound;
        csoundStart(); // somehow does not work without this...
        if (typeof(csound) !== "undefined") { // csound is in global space
            // csound instrument 1 (PlayInterval) parameters from p4 on:
            // amp, midinote, intervalRatio, cents, soundtype (1- sine, 2 - saw, 3- square), isMelodic (1|0)
            const volume = 0.3 ; // TODO: from parameters
            let csoundString = 'i 1 0 2 ';
            const soundType = 2;
            csoundString += volume + ' ';
            csoundString += midiNote + ' ';
            csoundString += intervalRatio + ' ';
            csoundString += deviation + ' ';
            csoundString +=  soundType +  ' '; // soundtype: 1- sine, 2 - saw, 3- square
            csoundString += isHarmonic ? ' 0 ' : ' 1 '; // melodic: 1- yes, 0 - harmonic
            console.log(csoundString);
            window.csound.readScore(csoundString);
        }

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

        // NB! MAth.abs(deviation) is wrong! should be cents -  put it to state
        if (exerciseHasBegun) {
            return (
                <Grid.Row  columns={2} centered={true}>
                    <Grid.Column>
                        <Button color={"green"} onClick={() => renew(0)} className={"fullWidth marginTopSmall"} >{t("playNext")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => play(baseMidiNote, intervalRatio, selectedDeviation)} className={"fullWidth marginTopSmall"}  >{t("repeat")}</Button>
                    </Grid.Column>
                </Grid.Row>

            );
        } else {
            return(
                <Grid.Row  >
                    <Grid.Column>
                    <Button color={"green"} onClick={() => startExercise()} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>
                    </Grid.Column>
                </Grid.Row>
            );
        }
    };

    const createResponseButtons = () => {
        return (
            <Grid.Row columns={3}>
                <Grid.Column>
                    <Button className={"exerciseBtn"}
                            onClick={() => checkResponse({intonation: "low"})}>{t("low")}
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button className={"exerciseBtn"}
                            onClick={() => checkResponse({intonation: "inTune"})}>{t("inTune")}
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button className={"exerciseBtn"}
                            onClick={() => checkResponse({intonation: "high"})}>{t("high")}
                    </Button>
                </Grid.Column>
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
            {/*<Helmet>*/}
            {/*    <script type="text/javascript" src="https://github.com/hlolli/csound-wasm/releases/download/6.12.0-5/csound-wasm-browser.js"></script>*/}
            {/*</Helmet>*/}
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