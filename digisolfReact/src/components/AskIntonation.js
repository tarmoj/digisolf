import React, { useState, useEffect } from 'react';
import {Button, Grid, Header, Dropdown} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setIsLoading} from "../actions/component";
import {getRandomElementFromArray, getRandomInt, scriptIsLoaded, capitalizeFirst} from "../util/util";
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import Score from "./Score";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";



const AskIntonation = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const name = useSelector(state => state.exerciseReducer.name);
    const isHarmonic = useSelector(state => state.exerciseReducer.isHarmonic);
    const cents = useSelector(state => state.exerciseReducer.cents);

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [intervalRatio, setIntervalRatio] = useState(1.5);
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [baseMidiNote, setBaseMidiNote] = useState(60);
    const [selectedDeviation, setSelectedDeviation] = useState(0);
    const [soundType, setSoundType] = useState(2);

    useEffect(() => {
        loadScript();
    }, []);

    const possibleDeviations = [5, 10, 20, 30];
    const possibleIntervalRatios = [4/3, 3/2, 2];

    const loadScript = () => {
        const scriptUrl = "https://github.com/hlolli/csound-wasm/releases/download/6.12.0-5/csound-wasm-browser.js";

        if (!scriptIsLoaded(scriptUrl)) {
            dispatch(setIsLoading(true));

            const script = document.createElement("script");
            script.src = scriptUrl;
            script.async = true;
            script.onload = () => dispatch(setIsLoading(false));

            document.body.appendChild(script);
        }
    };


    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);
        csoundStart();
        renew(cents);
    };



    const csoundStart = () => {
        console.log("*** CSOUND STARTED ***")
        const csound = window.csound;

        if (typeof(csound) === "undefined") {
            console.log("Csound is not ready yet!");
            return;
        }

        const csoundOrchestra = `

sr = 44100 
ksmps = 32
nchnls = 2
0dbfs = 1
        
giSine ftgen 1,0, 16384, 10, 1 ; Sine
giSawtooth ftgen 2,0,  16384, 10, 1, 0.5, 0.3, 0.25, 0.2, 0.167, 0.14, 0.125, .111   ; Sawtooth
giSquare ftgen 3,  0, 16384, 10, 1, 0,   0.3, 0,    0.2, 0,     0.14, 0,     .111   ; Square

; parameters from p4 -  amp, midinote, intervalRatio, cents, soundtype (1- sine, 2 - saw, 3- square), isMelodic (1|0)
instr PlayInterval
	iAmp = (p4==0) ? 0.2 : p4
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

        setAnswered(false);

        const deviationAmount =  (cents === 0) ? getRandomElementFromArray(possibleDeviations) : cents; // the number of cents the interval can be wrong

        const random = Math.random()*3;
        let deviation, intonation;
        if (random < 1) {
            deviation = 0-deviationAmount;
            intonation = "narrow";
        } else if (random > 2) {
            deviation = deviationAmount;
            intonation = "wide";
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
    const play = (midiNote=60, intervalRatio=1.5, deviation=0, melodic = 0) => {
        console.log("*** PLAY*** ");
        const duration = 4; // TODO: make configurable
        const csound = window.csound;
        if (typeof(csound) !== "undefined") { // csound is in global space
            // csound instrument 1 (PlayInterval) parameters from p4 on:
            // amp, midinote, intervalRatio, cents, soundtype (1- sine, 2 - saw, 3- square), isMelodic (1|0)
            const volume = 0.1 ; // TODO: from parameters
            let csoundString = 'i 1 0 2 ';
            //const soundType = 2;
            csoundString += volume + ' ';
            csoundString += midiNote + ' ';
            csoundString += intervalRatio + ' ';
            csoundString += deviation + ' ';
            csoundString +=  soundType +  ' '; // soundtype: 1- sine, 2 - saw, 3- square
            csoundString += melodic ? ' 1 ' : ' 0 '; // melodic: 1- yes, 0 - harmonic
            console.log(csoundString);
            csound.readScore(csoundString);
        }

    };

    const checkResponse = (response) => { // response is an object {key: value [, key2: value, ...]}
        //console.log(response);
        //const correctChord = t(selectedChord.longName); // TODO: translation
        if (!exerciseHasBegun) {
            alert(t("pressStartExsercise"));
            return;
        }

        if (answered) {
            alert(t("alreadyAnswered"));
            return;
        }



        setAnswered(true);
        const correct = JSON.stringify(response) === JSON.stringify(answer);
        let feedBackString = ` ${ capitalizeFirst( t("interval"))}  ${t("was")} `;
        if (answer.intonation === "inTune") {
            feedBackString += `${t("inTune")}.`;
        } else {
            feedBackString += `${Math.abs(selectedDeviation)}  ${t("cents")} ${t(answer.intonation)}.`;
        }

        if ( correct ) {
            dispatch(setPositiveMessage(`${ capitalizeFirst( t("correct") )}!  ${feedBackString}`, 5000));
            dispatch(incrementCorrectAnswers());
        } else {
            dispatch(setNegativeMessage(`${ capitalizeFirst( t("wrong") )}!  ${feedBackString}`, 5000));
            dispatch(incrementIncorrectAnswers());
        }
    };



    // UI ======================================================

    const createPlaySoundButton = () => {

        if (exerciseHasBegun) {
            return (
            <Grid.Row  columns={3} centered={true}>
                    <Grid.Column>
                        <Button color={"green"} onClick={() => renew(cents)} className={"fullWidth marginTopSmall"} >{t("playNext")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => play(baseMidiNote, intervalRatio, selectedDeviation, 0)} className={"fullWidth marginTopSmall"}  >{t("repeat")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => play(baseMidiNote, intervalRatio, selectedDeviation, 1)} className={"fullWidth marginTopSmall"}  >{t("repeatMelodically")}</Button>
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
                            onClick={() => checkResponse({intonation: "narrow"})}>{capitalizeFirst( t("narrow") )}
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button className={"exerciseBtn"}
                            onClick={() => checkResponse({intonation: "inTune"})}>{capitalizeFirst( t("inTune") )}
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button className={"exerciseBtn"}
                            onClick={() => checkResponse({intonation: "wide"})}>{capitalizeFirst( t("wide") )}
                    </Button>
                </Grid.Column>
            </Grid.Row>
        )
    };

    const onChangeFollower = (event, data) => {
        console.log("on change follower", data.value);
        setSoundType(data.value);

    }

    const createSoundTypeRow = () => {
        const soundOptions = [
            { text: capitalizeFirst(t("sine")), value: 1},
            { text: capitalizeFirst(t("saw")), value: 2},
            { text: capitalizeFirst(t("square")), value: 3},
        ];
        return (
          <Grid.Row >
              <Grid.Column> { `${capitalizeFirst(t("sound"))}: `} </Grid.Column>
              <Grid.Column>
                  <Dropdown
                      placeholder={capitalizeFirst(t("sound"))}
                      onChange={ onChangeFollower }
                      options ={soundOptions}
                      defaultValue={2}
                  />
              </Grid.Column>
          </Grid.Row>
        );
    };

    return (
        <div>
            <Header size='large'>{ `${t("intonationDescripton")} ${t(name)} ${t("cents")} ` }</Header>
            <Grid>
                <Score/>
                {createSoundTypeRow()}
                {createResponseButtons()}

                {createPlaySoundButton()}
                <Grid.Row>
                    <Grid.Column>

                        <GoBackToMainMenuBtn/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>

    );
};

export default AskIntonation;