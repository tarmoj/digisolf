import React, {useState, useEffect} from 'react';
import {Button, Checkbox, Dropdown, Grid, Header, Input, Label, Popup} from 'semantic-ui-react'
import {Slider} from "react-semantic-ui-range";

import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {arraysAreEqual, capitalizeFirst, deepClone, isDigit, simplify, weightedRandom} from "../util/util";

import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import ScoreRow from "./ScoreRow";
//import Notation from "../notation/Notation";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import Sound from 'react-sound';
import Select from "semantic-ui-react/dist/commonjs/addons/Select";
import {useParams} from "react-router-dom";
//import CsoundObj from "@kunstmusik/csound";
//import {makeInterval,  scaleDefinitions, getIntervalByShortName} from "../../util/intervals";
//import * as notes from "../../util/notes";
import {stringToIntArray, getRandomElementFromArray } from "../util/util"
//import {dictationOrchestra as orc} from "../../csound/orchestras";
//import {resetState, setAllowInput, setInputNotation} from "../../actions/askDictation";
//import {notationInfoToVtString} from "../notation/notationUtils";


const AskFunctions = () => {
    const { title } = useParams();

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [selectedDictation, setSelectedDictation] = useState({title:"", soundFile:"", functions:[]});
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);

    //const [showCorrectNotation, setShowCorrectNotation] =  useState(false);

    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
    const [volume, setVolume] = useState(0.6);


    // useEffect(() => {
    //     dispatch(resetState());
    // }, []);

    const dictations = [ // use variable "dictations" here, as in coincides with older code later
        {
            title: "1",
            soundFile: "/sounds/chords/functions/Fun1-1.mp3",
            functions: [ ["T"], ["D"], ["T"] ]  // functions by bars, can be several by bar
        },

        {
            title: "2",
            soundFile: "/sounds/chords/functions/Fun1-2.mp3",
            functions: [ ["T"], ["T"], ["D"] ]
        },

    ]



    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);
        if (title && dictations) {
            //find index of that dictation
            let index = dictations.findIndex( element => {
                if (element.title === title) {
                    return true;
                }
            });
            //console.log("was able to find index for ", title, index);
            if (index>=0) {
                renew(index);
            }
        }

    };


    const renew = (dictationIndex) => {
        console.log("Renew: ", dictationIndex);
        setAnswered(false);

        const dictation = dictations[dictationIndex];
        setSelectedDictation(dictation);
        const answer = {functions: dictation.functions};
        setAnswer(answer);

        if (exerciseHasBegun) {
            play(dictation);
        }

    };


    const play = (dictation) => {
        stop(); // need a stop here  - take care, that it does not kill already started event
        setPlayStatus(Sound.status.PLAYING);
    };

    const stop = () => {
        // console.log("***Stop***");
        setPlayStatus(Sound.status.STOPPED);
    };

    const checkResponse = (response) => { // response is an object {key: value [, key2: value, ...]}

        if (!exerciseHasBegun) {
            alert(t("pressStartExsercise"));
            return;
        }

        if (selectedDictation.notation.length === 0 ) {
            alert( t("chooseDictation"));
            return;
        }
    };




    // UI ======================================================

    const createControlButtons = () => {
        // console.log("Begun: ", exerciseHasBegun);

        if (exerciseHasBegun) {
            return  (
                <Grid.Row  columns={3} centered={true}>
                    <Grid.Column>
                        <Button color={"green"} onClick={() => play(selectedDictation)} className={"fullWidth marginTopSmall"} >
                            { capitalizeFirst( t("play")) }
                        </Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => stop()} className={"fullWidth marginTopSmall"}  >{ capitalizeFirst( t("stop") )}</Button>
                    </Grid.Column>
                   <Grid.Column>
                         <Button className={"fullWidth marginTopSmall"}
                                onClick={() => checkResponse(null)}>{capitalizeFirst(t("check"))}
                        </Button>
                    </Grid.Column>

                    {/* Following buttons only for degree dictations */}



                    {/*{ dictationType ==="degrees" &&
                    <Grid.Column>
                        <Button className={"fullWidth marginTopSmall"}
                                onClick={() => playTonic(selectedDictation.tonicVtNote)}>{capitalizeFirst(t("tonic"))}
                        </Button>
                    </Grid.Column>}

                    {  name.toString().startsWith("degrees_random") &&
                    <Grid.Column>
                        <Button className={"fullWidth marginTopSmall"}
                                onClick={() => renew(0)}>{capitalizeFirst(t("new"))}
                        </Button>
                    </Grid.Column>
                    }*/}

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
    const createVolumeRow = () => {
        return exerciseHasBegun && (
            <Grid.Row centered={true} columns={3}>

                <Grid.Column>
                    {capitalizeFirst(t("volume"))}
                    <Slider value={volume} color="blue"
                            settings={ {
                                min:0, max:1, step:0.01,
                                /*start: {volume},*/
                                value: {volume},
                                onChange: (value) => {
                                    setVolume(value);
                                }
                            } }
                    />
                </Grid.Column>
                <Grid.Column />
            </Grid.Row>
        );
    };

    const createSelectionMenu = () => {
        const options = [];
        // console.log("createSelectionMenu for: ", currentCategory, name);
        //const dictationsByCategory =  dictations.filter(dict =>  dict.category=== currentCategory);
        //TODO: rewtite in more modern style?
        for (let i=0; i< dictations.length; i++) {
                options.push( { value: i, text: dictations[i].title  } );
        }

        return  exerciseHasBegun &&  (
            <Grid.Row columns={2} centered={true}>
                <Grid.Column computer={"8"} tablet={"8"} mobile={"16"}>
                  <label className={"marginRight "}>{ capitalizeFirst(t("chooseDictation")) }</label>
                  <Select
                        className={"marginTopSmall fullwidth"}
                        placeholder={t("chooseDictation")}
                        options={options}
                        defaultValue= {title ? title : "" }
                        onChange={(e, {value}) => {
                            renew(value);
                        }
                        }
                    />
                </Grid.Column>
            </Grid.Row>
        );

    } ;

    const handleDictationFinishedPlaying = () => {
        setPlayStatus(Sound.status.STOPPED);
    };

    return (
        <div>
            <Header size='large'>{`${capitalizeFirst( t("functions") )} ${selectedDictation.title} `}</Header>

            <Sound
                url={process.env.PUBLIC_URL + selectedDictation.soundFile}
                volume={volume*100}
                loop={false}
                playStatus={playStatus}
                onFinishedPlaying={handleDictationFinishedPlaying}
            />


            <Grid celled={false}>
                <ScoreRow/>
                {createSelectionMenu()}


                {createVolumeRow()}
                {createControlButtons()}
                <Grid.Row>
                    <Grid.Column>
                        <GoBackToMainMenuBtn/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>

    );
};

export default AskFunctions;