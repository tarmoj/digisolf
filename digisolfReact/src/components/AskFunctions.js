import React, {useState, useEffect} from 'react';
import {Button, Checkbox, Dropdown, Grid, Header, Input, Label, Modal, Popup} from 'semantic-ui-react'
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
import {stringToIntArray, getRandomElementFromArray } from "../util/util"


const AskFunctions = () => {
    const { title } = useParams();

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [selectedDictation, setSelectedDictation] = useState({title:"", soundFile:"", functions:[]});
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [response, setResponse] = useState([]); //array of string like "T", "S, "D"
    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
    const [volume, setVolume] = useState(0.6);


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
        {
            title: "3",
            soundFile: "/sounds/chords/functions/Fun1-3.mp3",
            functions: [ ["T"],	["T"],	["D"],	["D"],	["T"],	["T"],	["D"] ]
        },
        {
            title: "4",
            soundFile: "/sounds/chords/functions/Fun1-4.mp3",
            functions: [ ["T"],	["D"],	["T"],	["T"],	["D"],	["D"],	["T"] ]
        },

        {
            title: "5",
            soundFile: "/sounds/chords/functions/Fun1-5.mp3",
            functions: [ ["T"],	["D"],	["T"],	["T"],	["D"],	["T"],	["D"] ]
        },

        {
            title: "6",
            soundFile: "/sounds/chords/functions/Fun1-6.mp3",
            functions: [ ["T"],	["D"],	["T"],	["D"],	["T"],	["T"],	["D"], ["D"] ]
        },

        {
            title: "7",
            soundFile: "/sounds/chords/functions/Fun1-7.mp3",
            functions: [ ["T"],	["D"],	["T"],	["D"],	["T"],	["T"],	["D"], ["T"] ]
        },

        {
            title: "8",
            soundFile: "/sounds/chords/functions/Fun1-8.mp3",
            functions: [ ["T"],	["T"],	["D"],	["D"],	["T"],	["D"],	["T"], ["D"] ]
        },

        {
            title: "9",
            soundFile: "/sounds/chords/functions/Fun1-9.mp3",
            functions: [ ["T"],	["D"],	["T"],	["D"],	["T"],	["T"],	["T"], ["D"] ]
        },

        {
            title: "10",
            soundFile: "/sounds/chords/functions/Fun1-10.mp3",
            functions: [ ["T",  "D"],	["T"],	["T"], ["D"]]
        },


    ]



    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);
        if (/*title && */dictations) {
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
        const answer = dictation.functions.flat(); // array of cuntions
        setAnswer(answer);
        setResponse(Array(answer.length).fill("--")); // cannot be empty array, otherwise clears response on every new render

        if (exerciseHasBegun) {
            play();
        }

    };


    const play = () => {
        stop(); // need a stop here  - take care, that it does not kill already started event
        setPlayStatus(Sound.status.PLAYING);
    };

    const stop = () => {
        // console.log("***Stop***");
        setPlayStatus(Sound.status.STOPPED);
    };

    const checkResponse = () => { // response is an object {key: value [, key2: value, ...]}

        if (!exerciseHasBegun) {
            alert(t("pressStartExsercise"));
            return;
        }

        if (!selectedDictation.title ) {
            alert( t("chooseDictation"));
            return;
        }

        setAnswered(true);
        let correct = true;

        for (let i=0; i<answer.length; i++) {
            if (response[i]==answer[i]) {
                console.log("Correct! ", i, response[i]);
            } else {
                console.log(response[i], " is wrong!  Should be: ", answer[i]);
                correct = false;
            }
        }

        if ( correct ) {
            //dispatch(setPositiveMessage(feedBack, 5000));
            dispatch(incrementCorrectAnswers());
        } else {
            //dispatch(setNegativeMessage(feedBack, 5000));
            dispatch(incrementIncorrectAnswers());
        }

    };




    // UI ======================================================

    const createControlButtons = () => {

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
                <Grid.Column />
                <Grid.Column>
                    {capitalizeFirst(t("volume"))}
                    <Slider value={volume} color="blue"
                            settings={ {
                                min:0, max:1, step:0.01,
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
                        onChange={(e, {value, text}) => {
                            //title = text;
                            renew(value);
                        }
                        }
                    />
                </Grid.Column>
            </Grid.Row>
        );

    } ;

    const handleFunctionChange = (index, value, closeDialog=true) => {
        let r = response.slice();
        if (r.length>index) {
            r[index] = value;
            setResponse(r); // somehow this does not cause rerender
            //setVolume(volume + 0.01);
            console.log("Setting response: ", index, response);
            if (closeDialog) {
                setDialogOpen(false);
            }
        }
    }

    const FunctionBox = (props) => {
        // good for visible impaired, for touch screens all buttons visible is better
        const index = props.index;
        const functionOptions = [
            { key: 'none', text: '--', value: '--'},
            { key: 'T', text: 'T', value: 'T'},
            { key: 'S', text: 'S', value: 'S'},
            { key: 'D', text: 'D', value: 'D'},
            { key: 'M', text: 'M', value: 'M'}
        ];
        return (
            <React.Fragment>
            <Dropdown
                options={functionOptions}
                className={  answered ?  (answer[index]===response[index] ? "green" : "red")  : ""  }
                style = { {marginLeft:2, marginRight:2}}
                defaultValue={response[index] ? response[index] : "--"}
                onChange={ (event, data) => {
                    handleFunctionChange(index, data.value)
                }
                }
            />
            </React.Fragment>
        );
    }



    const [dialogOpen, setDialogOpen] = useState(false);
    const FunctionBox2 = (props) => {
        const index = props.index ? props.index : 0;
        const label = response[index] ? response[index] : "?";
        return (
            <React.Fragment>
                <Popup
                    content={
                        <Button.Group toggle={true} >
                            <Button
                                onClick={ (event, data) =>
                                    handleFunctionChange(index,"T", true) }
                            >T</Button>
                            <Button
                                onClick={ () =>
                                    handleFunctionChange(index,"S", true) }
                            >S</Button>
                            <Button
                                onClick={ () =>
                                    handleFunctionChange(index,"D", true) }
                            >D</Button>
                            <Button
                                onClick={ () =>
                                    handleFunctionChange(index,"M", true) }
                            >M</Button>
                        </Button.Group>
                    }
                    on='click'
                    trigger={<Button content={response[index]}
                                     className={  answered ?  (answer[index]===response[index] ? "green" : "red")  : ""  }
                    />}
                />

            </React.Fragment>
        );
    }

    const createResponseBlock = () => {
        let index = 0;
        let elements = [];

        for (let measure of selectedDictation.functions ) {
            for (let f of measure ) {
                elements.push(<FunctionBox index={index}/>);
                index++;
            }
            elements.push(" | ");
        }

        return exerciseHasBegun &&  selectedDictation.title && (
            <div className={"marginLeft"}>
                <span className={"marginLeft marginRight"}>{capitalizeFirst(t("enterFunctions"))}: </span>
                { elements }
            </div>
        );
    }

    const createResponseBlock2 = () => {
        let index = 0;
        let elements = [];

        for (let measure of selectedDictation.functions ) {
            for (let f of measure ) {
                elements.push(<FunctionBox2 index={index}/>);
                index++;
            }
            elements.push(" | ");
        }

        return exerciseHasBegun &&  selectedDictation.title && (
            <div className={"marginLeft"}>
                <span className={"marginLeft marginRight"}>{capitalizeFirst(t("enterFunctions"))} nuppudena: </span>
                { elements }
            </div>
        );
    }

    const createCorrectAnswerBlock = () => {
        let functionsString = "";
        for (let measure of selectedDictation.functions ) {
            for (let f of measure ) {
                functionsString += " " + f + " ";
            }
            functionsString += " | ";
        }

        return exerciseHasBegun &&  answered && (
            <div className={"marginLeft"}>
                <span className={"marginLeft marginRight"}>
                    {capitalizeFirst(t("correctAnswerIs"))}: {functionsString}
                </span>
            </div>
        );
    }

    return (
        <div>
            <Header size='large'>{`${capitalizeFirst( t("functions") )} ${selectedDictation.title} `}</Header>

            <Sound
                url={process.env.PUBLIC_URL + selectedDictation.soundFile}
                volume={volume*100}
                loop={false}
                playStatus={playStatus}

                onFinishedPlaying={()=>stop()}

            />


            <Grid celled={false}>
                <ScoreRow/>
                {createSelectionMenu()}
                {createResponseBlock()}
                {createResponseBlock2()}
                {createCorrectAnswerBlock()}
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