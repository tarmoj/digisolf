import React, { useState, useEffect } from 'react';
import {Button, Grid, Header, Dropdown} from 'semantic-ui-react'
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



const AskIntonation = () => {
    const { name, cents } = useParams();


    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // const name = useSelector(state => state.exerciseReducer.name);
    // const cents = useSelector(state => state.exerciseReducer.cents);

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [intervalRatio, setIntervalRatio] = useState(1.5);
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [baseMidiNote, setBaseMidiNote] = useState(60);
    const [selectedDeviation, setSelectedDeviation] = useState(0);
    const [soundType, setSoundType] = useState(2);

    //const [started, setStarted] = useState(false);

    const [csound, setCsound] = useState(null);
    useEffect(() => {
        if (csound == null) {
            let audioContext = CsoundObj.CSOUND_AUDIO_CONTEXT;
            if ( typeof (audioContext) == "undefined") {
                CsoundObj.initialize(CsoundObj.CSOUND_AUDIO_CONTEXT).then(() => { // the error happens here with initialize...
                    const cs = new CsoundObj();
                    setCsound(cs);
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
            const volume = 0.1 ; // TODO: from parameters
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

            { csound == null ? (
                <header className="App-header">
                    <p>Loading...</p> {/*Sometimes gets stuck here when you go back to main menu and open intonation again*/}
                </header>
            ) : (

            <Grid>
                <ScoreRow/>
                {createSoundTypeRow()}
                {createResponseButtons()}

                {createPlaySoundButton()}
                <Grid.Row>
                    <Grid.Column>

                        <GoBackToMainMenuBtn/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
                )}
        </div>

    );
};

export default AskIntonation;