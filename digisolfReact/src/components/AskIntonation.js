import React, { useState, useEffect } from 'react';
//import {Header, Dropdown} from 'semantic-ui-react'
import {Button, CircularProgress, Grid, MenuItem, Select} from "@material-ui/core"
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setIsLoading} from "../actions/component";
import {getRandomElementFromArray, getRandomInt, scriptIsLoaded, capitalizeFirst} from "../util/util";
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import ScoreRow from "./ScoreRow";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import {useParams} from "react-router-dom";
import CsoundObj from "@kunstmusik/csound";
import  {intonationOrchestra as orc} from "../csound/orchestras";
import Volume from "./Volume";
import {resetState} from "../actions/askDictation";



const AskIntonation = () => {
    const { name, cents } = useParams();


    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    //const VISupportMode = useSelector(state => state.exerciseReducer.VISupportMode);
    const masterVolume = useSelector(state => state.exerciseReducer.volume);

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [intervalRatio, setIntervalRatio] = useState(1.5);
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [baseMidiNote, setBaseMidiNote] = useState(60);
    const [selectedDeviation, setSelectedDeviation] = useState(0);
    const [soundType, setSoundType] = useState(2);
    const [csound, setCsound] = useState(null);

    useEffect(() => {
        dispatch(resetState());
        document.title = `${ capitalizeFirst( t("intonation") )}`;
    }, []);

    useEffect(() => {
        if (csound == null) {
            // try global loader - shows but does not cover everything
            //dispatch(setIsLoading(true)); // - does not work well
            let audioContext = CsoundObj.CSOUND_AUDIO_CONTEXT;
            if ( typeof (audioContext) == "undefined") {
                CsoundObj.initialize(CsoundObj.CSOUND_AUDIO_CONTEXT).then(() => { // the error happens here with initialize...
                    const cs = new CsoundObj();
                    setCsound(cs);
                    //dispatch(setIsLoading(false));
                });
            } else { // do not initialize if audio context is already created
                const cs = new CsoundObj();
                setCsound(cs);
            }
        } else {
            console.log("Csound RESET");
            csound.reset();
        }
    }, [csound]);

    // this orchestra does not use volume channel (yet)
    // useEffect(  ()=>{
    //     if (csound) {
    //         csound.setControlChannel("volume", masterVolume);
    //     }
    // }, [masterVolume]);


    const startCsound = () => {
        csound.compileOrc(orc);
        csound.start();
        csound.audioContext.resume();
        //setStarted(true);
    };


    const possibleDeviations = [5, 10, 20, 30];
    const possibleIntervalRatios = [4/3, 3/2, 2];



    // EXERCISE LOGIC ======================================

    const startExercise = () => { // this is probably the same as setStarted
        startCsound();
        setExerciseHasBegun(true);
        //renew(cents);
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
        //const duration = 4; // TODO: make configurable
        if (typeof(csound) !== "undefined") { // csound is in global space
            // csound instrument 1 (PlayInterval) parameters from p4 on:
            // amp, midinote, intervalRatio, cents, soundtype (1- sine, 2 - saw, 3- square), isMelodic (1|0)
            const volume = masterVolume*0.5; //was: 0.1 ;
            let csoundString = 'i 1 0 2 ';
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

        if (!answer) {
            alert(t("pressPlayFirst"));
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
            dispatch(setPositiveMessage(`${ capitalizeFirst( t("correct") )}!  ${feedBackString}`, 3000));
            dispatch(incrementCorrectAnswers());
            const waitTime =  1500;
            setTimeout( ()=> renew(cents), waitTime); // small delay to let user to see the answer
        } else {
            dispatch(setNegativeMessage(`${ capitalizeFirst( t("wrong") )}!  ${feedBackString}`, 3000));
            dispatch(incrementIncorrectAnswers());
        }
    };



    // UI ======================================================

    const createPlaySoundButton = () => {

        if (exerciseHasBegun) {
            return (
            <Grid item container direction={"row"} spacing={1}>
                    <Grid item xs={4}>
                        <Button variant="contained" color={"primary"} onClick={() => renew(cents)} className={"fullWidth marginTopSmall"} >{t("playNext")}</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" onClick={() => play(baseMidiNote, intervalRatio, selectedDeviation, 0)} className={"fullWidth marginTopSmall"}  >{t("repeat")}</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" onClick={() => play(baseMidiNote, intervalRatio, selectedDeviation, 1)} className={"fullWidth marginTopSmall"}  >{t("repeatMelodically")}</Button>
                    </Grid>
                </Grid>

            );
        } else {
            return(
                <Grid item container direction={"row"} spacing={1} >
                    <Button variant="contained" color={"primary"}
                            className={"fullWidth marginTopSmall"}
                            disabled={(csound === null)}
                            onClick={() => startExercise()}
                    >
                        {(csound === null) ? <CircularProgress aria-busy={(csound===null)} /> :  t("startExercise")}
                    </Button>
                </Grid>
            );
        }
    };

    const createResponseButtons = () => {
        return exerciseHasBegun && (
            <Grid item container direction={"row"} justifyContent={"center"} spacing={1}>
                <Grid item xs={4}>
                    <Button variant="contained" className={"exerciseBtn"}
                            onClick={() => checkResponse({intonation: "narrow"})}>{capitalizeFirst( t("narrow") )}
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" className={"exerciseBtn"}
                            onClick={() => checkResponse({intonation: "inTune"})}>{capitalizeFirst( t("inTune") )}
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" className={"exerciseBtn"}
                            onClick={() => checkResponse({intonation: "wide"})}>{capitalizeFirst( t("wide") )}
                    </Button>
                </Grid>
            </Grid>
        )
    };

    const onChangeFollower = (event) => {
        console.log("on change follower", event.target.value);
        setSoundType(event.target.value);

    }

    const createSoundTypeRow = () => {

        return  exerciseHasBegun && (
          <Grid item container direction={"row"} justifyContent={"flex-start"} spacing={2}>
              <Grid item> { `${capitalizeFirst(t("sound"))}: `} </Grid>
              <Grid item>
                  <Select
                      labelId="label" id="instrumentSelect"
                      onChange={ onChangeFollower }
                      value={soundType}
                  >
                      <MenuItem value={1}>{t("sine")}</MenuItem>
                      <MenuItem value={2}>{t("saw")}</MenuItem>
                      <MenuItem value={3}>{t("square")}</MenuItem>
                  </Select>

              </Grid>
              <Grid item xs={4}><Volume /></Grid>
          </Grid>
        );
    };

    return (
        <div>
            <h2>{ `${t("intonationDescripton")} ${t(name)} ${t("cents")} ` }</h2>

            <Grid container direction={"column"} spacing={1}>
                <ScoreRow/>
                {createSoundTypeRow()}
                {createResponseButtons()}

                {createPlaySoundButton()}
                <Grid item container>
                        <GoBackToMainMenuBtn/>
                </Grid>
            </Grid>
        </div>

    );
};

export default AskIntonation;