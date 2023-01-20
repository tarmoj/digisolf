import React, {useState, useEffect} from 'react';
import { Grid, Input} from 'semantic-ui-react';
import {Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from '@material-ui/core'; // start porting to material ui

import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import { capitalizeFirst, isDigit, weightedRandom} from "../../util/util";
import {setNegativeMessage, setPositiveMessage} from "../../actions/headerMessage";
import ScoreRow from "../ScoreRow";
import Notation from "../notation/Notation";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../../actions/score";
import GoBackToMainMenuBtn from "../GoBackToMainMenuBtn";
import Select from "semantic-ui-react/dist/commonjs/addons/Select";
import {useParams} from "react-router-dom";
import CsoundObj from "@kunstmusik/csound";
import {makeInterval,  scaleDefinitions, getIntervalByShortName} from "../../util/intervals";
import * as notes from "../../util/notes";
import {stringToIntArray, getRandomElementFromArray } from "../../util/util.js"
import {dictationOrchestra as orc} from "../../csound/orchestras";
import {dictations as degrees} from "../../dictations/degrees";
import {resetState, setAllowInput, setInputNotation} from "../../actions/askDictation";
import VolumeRow from "../VolumeRow";


const AskDegreeDictation = () => {
    const { name, title } = useParams(); // title is optional, used for opening the dictation by url

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const defaultNotationInfo = {  clef:"treble", time: "4/4", vtNotes: "" };

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [selectedDictation, setSelectedDictation] = useState({title:"", soundFile:"", notation:""});
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [showCorrectNotation, setShowCorrectNotation] =  useState(false);

    const [degreesEnteredByUser, setDegreesEnteredByUser] = useState("");

    const [correctVtString, setCorrectVtString] = useState("");
    const [correctNotationWidth, setCorrectNotationWidth] = useState (400);
    const [difficultyLevel, setDifficultyLevel ] = useState("simple"); // simple|medium|difficult


    const VISupportMode = useSelector(state => state.exerciseReducer.VISupportMode); // TODO: no real support for that now
    const masterVolume = useSelector(state => state.exerciseReducer.volume);
    const instrument =  useSelector(state => state.exerciseReducer.instrument);
    //const bassInstruments =  ["trombone", "cello", "bassoon"]; // NB! update when new instruments are added.


    useEffect(  () => {
        if (csound) {
            loadResources(csound,  60, 84, instrument).then(console.log("resources loaded")); // NB! should use async () amd await loadResources in normal case
        }
    }, [instrument]);

    useEffect(  () => {
        if (csound) {
            csound.setControlChannel("volume", masterVolume);
        }
    }, [masterVolume]);


    useEffect(() => {
        dispatch(resetState());
        document.title = `${ capitalizeFirst( t("degreeDictations") )}`;
    }, []);

    // probably we don't need that any more since address changes...
    //const dictationType = name.toString().split("_")[0]; // categories come in as 1voice_level1 etc

    let dictations = degrees;

    const inputNotation = useSelector(state => state.askDictationReducer.inputNotation);
    const allowInput = useSelector(state => state.askDictationReducer.allowInput);



    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);
        if (title && dictations) {
            //find index of that dictation
            let index = dictations.findIndex( element => {
                if (element.title === title && element.category.startsWith(name)) {
                    return true;
                } else {
                    return false;
                }
            });
            //console.log("was able to find index for ", title, index);
            if (index>=0) {
                renew(index);
            }
        }

        if (!csoundStarted) {
            startCsound();
        }

        if (name.includes("random")) {
            renew(0);
        }

    };


    const renew = (dictationIndex) => {
        console.log("Renew: ", dictationIndex);
        setAnswered(false);
        setDegreesEnteredByUser("");
        setShowCorrectNotation(false);

        let dictation;

        if (!name.includes("random")) {
            dictation = dictations[dictationIndex];
        }

        let answer = null;

        if ( name.includes("degrees_random")) {
            dictation = generateDegreeDictation();
            console.log("new dictation: ", dictation.degrees, dictation.scale, dictation.tonicVtNote);
        }

        const {vtString, midiNotes} = degreesToNotes(dictation.degrees, dictation.scale, dictation.tonicVtNote);
        console.log("Constructed notation: ", vtString);
        dictation.notation = vtString; // is it still necessary?
        setCorrectVtString(vtString);
        // do I need setCorrectNotation for anything???

        dictation.midiNotes = midiNotes;
        answer = {degrees: stringToIntArray(dictation.degrees) };

        setSelectedDictation(dictation);
        setAnswer(answer);

        if (exerciseHasBegun) {
            play(dictation);
        }

    };

    const generateDegreeDictation = () => {
        // a degree dictaion has 7 notes, on degrees of the scale 1..7
        // a tonic as vextab note and the scale
        //NB! the biggest degree allowed is 7!
        const possibleTonicNotes = ["G/4", "A/4", "C/5"];
        const possibleScales = ["major", "minorNatural", "minorHarmonic"]; // maybe scale should be given as a parameter
        //const possibleDegrees = [-5, -6, -7, 1, 2, 3, 4, 5, 6, 7];
        const maxNotes = 7;

        let degrees = [];

        const firstNoteProbabilities = { 1:0.6, 3:0.2, 5:0.1, 2:0.1 };
        const followUpProbabilitiesSimple = { // probabilities, what comes after the given degree
            "1": {2:0.4 , 3:0.2, 5:0.1, "-7":0.25, "-5":0.05  }, // give 5 steps, probabilities must sum to 1, like 0.4, 0.25, 0.2, 0.1, 0.05)
            "2": {3:0.4 , 1:0.25, 4:0.1, "-7":0.1, "-5":0.05  },
            "3": {4:0.4 , 1:0.25, 2:0.1, 5:0.1, 6:0.05  },
            "4": {5:0.4 , 2:0.25, 1:0.1, 6:0.1, "-7":0.05  },
            "5": {4:0.4 , 6:0.25, 1:0.1, 3:0.1, "-5":0.05  },

            "6": {5:0.4 , 4:0.25, 7:0.1, 2:0.1, "-6":0.05  },
            "7": {6:0.4 , 5:0.25, 2:0.1, 4:0.1, "-7":0.05  },
            "-7": {1:0.5 , 2:0.25, "-6":0.15, "-5":0.1  },
            "-6": {"-5":0.4 , "-7":0.25, 1:0.1, 2:0.1, 6:0.05  },
            "-5": {1:0.5 , "-6":0.25, 2:0.15, "-7":0.1  },
        };

        const followUpProbabilitiesMedium = { // probabilities, what comes after the given degree
            "1": {4:0.4 , 6:0.2, 5:0.1, "-6":0.25, "-5":0.05  }, // give 5 steps, probabilities must sum to 1, like 0.4, 0.25, 0.2, 0.1, 0.05)
            "2": {6:0.4 , 7:0.25, 4:0.1, "-6":0.1, "-5":0.05  },
            "3": {"-7":0.4 , 6:0.25, 2:0.1, 7:0.1, "-5":0.05  },
            "4": {"-7":0.4 , 7:0.25, 1:0.1, 6:0.1, "-5":0.05  },
            "5": {"-5":0.4 , 2:0.25, 1:0.1, 3:0.1, "-7":0.05  },

            "6": {"-6":0.4 , 2:0.25, 7:0.1, 4:0.1, 1:0.05  },
            "7": {6:0.4 , 5:0.25, 2:0.1, 4:0.1, "-7":0.05  },
            "-7": {5:0.5 , 2:0.25, "-5":0.15, 4:0.1  },
            "-6": {5:0.4 , 2:0.25, 4:0.1, 1:0.1, 6:0.05  },
            "-5": {1:0.5 , 4:0.25, 2:0.15, "-7":0.1  },
        };

        const followUpProbabilitiesHard = { // probabilities, what comes after the given degree
            "1": {7:0.5 , 6:0.2, "-6":0.25, 4:0.05  }, // give 5 steps, probabilities must sum to 1, like 0.4, 0.25, 0.2, 0.1, 0.05)
            "2": {7:0.4 , 6:0.25, "-6":0.1, 5:0.1, "-5":0.05  },
            "3": {"-5":0.4 , 7:0.25, "-6":0.1, 5:0.1, 2:0.05  },
            "4": {"-7":0.4 , "-5":0.25, 1:0.1, 6:0.1, 2:0.05  },
            "5": {"-6":0.4 , "-7":0.25, 1:0.1, 4:0.1, "-5":0.05  },

            "6": {"-5":0.4 , 2:0.25, 3:0.1, "-7":0.1, "-6":0.05  },
            "7": {4:0.4 , "-6":0.25, 2:0.1, 1:0.1, "-7":0.05  },
            "-7": {3:0.5 , 6:0.25, 2:0.15, 1:0.1  },
            "-6": {4:0.4 , 7:0.25, 5:0.1, 2:0.1, 6:0.05  },
            "-5": {7:0.5 , 4:0.25, 2:0.15, 3:0.1  },
        };

        let followUpProbabilities = followUpProbabilitiesSimple; // by default
        if (difficultyLevel==="medium") followUpProbabilities = followUpProbabilitiesMedium;
        if (difficultyLevel==="difficult") followUpProbabilities = followUpProbabilitiesHard;
        console.log("Difficulty ", difficultyLevel, followUpProbabilities);

        degrees[0] =  parseInt( weightedRandom(firstNoteProbabilities) );
        console.log("First note: ", degrees[0]);

        let degreesString = "";

        for (let i=1; i<maxNotes; i++) {
            // simple random:
            // degrees[1] = getRandomElementFromArray(possibleDegrees);

            // apply melodic likelyhood

            const lastDegree = degrees[i-1].toString();
            degrees[i] = weightedRandom( followUpProbabilities[lastDegree] );
            console.log("Lastdegree, new degree: " , degrees[i-1], degrees[i] );
        }
        degreesString = degrees.join(" ");
        console.log("degreeString: ", degreesString)

        return {
            title: "generated",
            degrees: degreesString,
            tonicVtNote: getRandomElementFromArray(possibleTonicNotes),
            scale: getRandomElementFromArray(possibleScales)
        };
    };

    const degreesToNotes = ( degreeString, scale, tonicVtNote) => { // returns object {vtString: <string>, midiNotes: [] }
        if (scaleDefinitions.hasOwnProperty(scale) ) {
            const midiNotes = [];
            let vtString = "stave time=4/4\nnotes :4 "; // TODO: key
            const baseNote = notes.getNoteByVtNote(tonicVtNote);
            const melodyDegrees = stringToIntArray(degreeString); // split by comma or white space
            let counter = 1;
            for (let degree of melodyDegrees) {
                if (degree < -7 || degree > 8  ) {
                    console.log("Wrong degree: ", degree);
                    break;
                }
                const interval = scaleDefinitions[scale][Math.abs(degree)-1];
                if (interval) {
                    let note = (degree<0) ? makeInterval( baseNote, getIntervalByShortName(interval).inversion, "down" )
                        :  makeInterval(baseNote, interval, "up"); // what if bass clef?
                    if (note) {
                        console.log("Tonic, Interval, note: ", tonicVtNote, interval, note.vtNote );
                        if (Math.abs(degree)===8) degree=1; // 1 is correct in theory, 8 is necessary to mark the octave
                        vtString += ` ${note.vtNote}  $ ${Math.abs(degree) } $ `; // add the
                        if (counter%4 === 0) {
                            vtString += " | ";
                        }
                        counter += 1;
                        midiNotes.push(note.midiNote);
                    }
                } else {
                    console.log("Could not find interval for scale, degree: ", scale, degree);
                }
            }
            // add rest end bar -  now all dictations have 7 notes. If it changes, this here will not make sense...
            // for H5P maybe add rule that degreeDictations must have exactly 7 notes.. (or less)
            vtString += " ## =|= ";
            //vtString += "\noptions space=15\n"; <- does not work yet since Notation.redraw wants to add "=|=", fix later.
            return {vtString: vtString, midiNotes: midiNotes};
        } else {
            console.log("Could not find scale: ", scale );
            return {vtString: "", midiNotes: []};
        }
    };



    const play = (dictation) => {
        stop(); // need a stop here  - take care, that it does not kill already started event
        const beatLength = 1.2;
        playTonic(dictation.tonicVtNote, 1*beatLength, 0.1);
        playCsoundSequence(dictation, 2*beatLength+0.1, beatLength );
    };

    const playTonic = (tonicVtNote=0, duration=1, when=0) => {

        const midiNote = notes.getNoteByVtNote(tonicVtNote).midiNote;
        const scoreLine = `i "PlayNote" ${when} ${duration} ${midiNote}`;
        console.log("Play tonic in Csound: ", scoreLine);
        if (csound) {
            csound.readScore(scoreLine);
        } else {
            console.log("csound is null");
        }
    }

    const playCsoundSequence = (dictation, startTime = 0, beatLength=1) => {
        //const dictation = selectedDictation; //dictations[dictationIndex];
        console.log("BeatLength:", beatLength);
        if ( dictation.hasOwnProperty("midiNotes") ) {
            const compileString = `giNotes[] fillarray ${dictation.midiNotes.join(",")}`;
            console.log("Compile: ", compileString);
            csound.compileOrc(compileString);
            //csound.setControlChannel("beatLength", beatLength);
            csound.readScore(`i 1 ${startTime} -1 ${beatLength} `);
        }
    };

    const stop = () => {
        // console.log("***Stop***");
        if (csound) {
            csound.readScore("i \"Stop\" 0  0.01");
        }
    };

    const showDictation = () => {
        if (selectedDictation.notation.length === 0 ) {
            alert( t("chooseDictation"));
            return;
        }

        dispatch(setAllowInput(!allowInput));
        setShowCorrectNotation(!showCorrectNotation);

        // Empty wrong note indexes if "Kontrolli" has been pressed second time
        // if (showCorrectNotation) {
        //     setWrongNoteIndexes(null);
        // }
    };

    const checkDegrees = () => checkResponse( {degrees: stringToIntArray(degreesEnteredByUser) } );

    const checkDegreesResponse = (degrees) => {
        let correct = true;
        const correctArray = answer.degrees;

        for (let i=0; i<correctArray.length; i++ ) {
            const responseDegree = Math.abs(degrees[i]);
            const correctDegree = Math.abs(correctArray[i]);

            if (responseDegree !== correctDegree ) { // ignore minus signs
                if (correctDegree === 8 && responseDegree===1) { // there is no 8. degree actually, 1st is correct but allow both in the answer
                    correct = true;
                } else {
                    console.log("Wrong degree: ", i, degrees[i]);
                    correct = false;
                }
            }
        }

        showDictation();
        return correct;
    }

    const checkResponse = (response) => { // response is an object {key: value [, key2: value, ...]}

        if (!exerciseHasBegun) {
            alert(t("pressStartExsercise"));
            return;
        }

        if (selectedDictation.notation.length === 0 ) {
            alert( t("chooseDictation"));
            return;
        }

        let feedBack = ""; // feedback and correct only for degree dictations
        let correct = true;
        correct = checkDegreesResponse(response.degrees); // Tarmo: not sure if different function makes sense -  more difficult to form the feedback in future
        if ( correct ) {
            dispatch(setPositiveMessage(feedBack, 5000));
            dispatch(incrementCorrectAnswers());
        } else {
            dispatch(setNegativeMessage(feedBack, 5000));
            dispatch(incrementIncorrectAnswers());
        }


    };



    // Csound functions =============================================

    const [csoundStarted, setCsoundStarted] = useState(false);
    const [csound, setCsound] = useState(null);

    useEffect(() => {
        // console.log("Csound effect 1");
        if (csound === null) {
            let audioContext = CsoundObj.CSOUND_AUDIO_CONTEXT;
            if ( typeof (audioContext) == "undefined") {
                CsoundObj.initialize().then(() => {
                    const cs = new CsoundObj();
                    setCsound(cs);
                });
            } else { // do not initialize if audio context is already created
                const cs = new CsoundObj();
                setCsound(cs);
            }

        } else { // tried to have the second effect here, but resets sometimes too early...
            csound.reset();
        }
    }, [csound]);

    async function loadResources(csound,  startinNote=60, endingNote=84, instrument="oboe") {
        if (!csound) {
            return false;
        }
        console.log("LOAD RESOURCES")
        for (let i = startinNote; i <= endingNote; i++) {
            const fileUrl = "sounds/instruments/" + instrument + "/" + i + ".ogg";
            const serverUrl = `${process.env.PUBLIC_URL}/${fileUrl}`;
            //console.log("Trying to load URL ",serverUrl);
            const f = await fetch(serverUrl);
            const fName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            const path = `${fName}`;
            const buffer = await f.arrayBuffer();
            // console.log(path, buffer);
            await csound.writeToFS(path, buffer);
        }
        return true;
    }

    const startCsound = async () => {
        console.log('start csound')
        if (csound) {
            await loadResources(csound, 60, 84, instrument);

            csound.setOption("-d");
            csound.setOption("-m0");
            csound.compileOrc(orc);
            csound.start();
            csound.audioContext.resume();
            setCsoundStarted(true);
        } else {
            console.log("StartCsound: csound is null.");
        }
    };



    // UI ======================================================

    const createControlButtons = () => {
        // console.log("Begun: ", exerciseHasBegun);

        if (exerciseHasBegun) {
            return (
                <Grid.Row  columns={3} centered={true}>
                    <Grid.Column>
                        <Button variant="contained" color={"primary"} onClick={() => play(selectedDictation)} className={"fullWidth marginTopSmall"} >
                            { capitalizeFirst( t("play")) }
                        </Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button variant="contained"  onClick={() => stop()} className={"fullWidth marginTopSmall"}  >{ capitalizeFirst( t("stop") )}</Button>
                    </Grid.Column>

                    <Grid.Column>
                        <Button variant="contained" className={"fullWidth marginTopSmall"}
                                onClick={() => playTonic(selectedDictation.tonicVtNote)}>{capitalizeFirst(t("tonic"))}
                        </Button>
                    </Grid.Column>

                    {  name.toString().startsWith("degrees_random") &&
                    <Grid.Column>
                        <Button variant="contained" className={"fullWidth marginTopSmall"}
                                onClick={() => renew(0)}>{capitalizeFirst(t("new"))}
                        </Button>
                    </Grid.Column>
                    }

                </Grid.Row>

            );
        } else {
            return(
                <Grid.Row  >
                    <Grid.Column>
                        <Button variant="contained" color={"primary"} onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>
                    </Grid.Column>
                </Grid.Row>
            );
        }
    };



    const createDegreeDictationInput = () => { // if degreedictation, Input for  degrees (text), otherwise lilypondINpute + Notation
        return (exerciseHasBegun) ? (
            <div>
                <div id={"difficultyChoice"} className={"marginRight"}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{capitalizeFirst(t("difficulty"))}</FormLabel>
                        <RadioGroup row aria-label="setDifficultyLevel" name="difficultyLevel" value={difficultyLevel}
                                    onChange={ (e) => {
                                        console.log("difficulty value: ", e.target.value);
                                        setDifficultyLevel( e.target.value);
                                    }}
                        >
                            <FormControlLabel value="simple" control={<Radio />} label={t("simpleSingular")} />
                            <FormControlLabel value="medium" control={<Radio />} label={t("medium")} />
                            <FormControlLabel value="difficult" control={<Radio />} label={t("difficult")} />
                        </RadioGroup>
                    </FormControl>
                </div>
                <label className={"marginRight"}>{  capitalizeFirst( t("enterDegrees") ) + " " }
                    {name.includes("random") ? t("inMode") : ""} <b>{ t(selectedDictation.scale) }</b>: </label>
                <Input
                    className={"marginRight"}
                    onChange={e => {
                        let input = e.target.value;
                        const index = input.length-1;
                        // if two last symbols are digits, insert a space in between of them
                        if (index>=1) {
                            if (isDigit(input.charAt(index)) && isDigit(input.charAt(index-1))) {
                                input = input.substr(0, index) + " " + input.substr(index);
                                console.log("Inserted space: ", input, index, input.substr(0, index));
                            }
                        }
                        setDegreesEnteredByUser(input);
                    } }
                    onKeyPress={ e=> {
                        if (e.key === 'Enter') {
                            checkDegrees();
                        }
                    }
                    }
                    placeholder={'nt: 1 3 2 4 7 1'}
                    value={degreesEnteredByUser}
                />

                <Button variant="contained" onClick={ checkDegrees }>{ capitalizeFirst( t("answer") )}</Button>

            </div>
        ) : null;

    };


    const createCorrectNotationBlock = () => {
        if (exerciseHasBegun && selectedDictation.title !== "" && showCorrectNotation) {
            return (
                <>
                    { selectedDictation.hasOwnProperty("credits") &&
                    <Grid.Row className={"marginTopSmall"}>{ capitalizeFirst(t("credits")) }: {selectedDictation.credits}</Grid.Row>
                    }
                    <Notation className={"marginTopSmall center"}
                          scale={1}
                          vtString={correctVtString}
                          showInput={false}
                          name={"correctNotation"}
                          width={correctNotationWidth}
                    />
                </>
            )
        }
    };

    const getWidth = (notation) => {
        let noteCount = 0;
        // find the number of notes on the stave that has the most notes;
        for (let stave of notation.staves) {
            if (stave.voices[0].notes.length>noteCount) {
                noteCount = stave.voices[0].notes.length;
            }
        }
        return  Math.max( noteCount * 30, 400);
    };

    const createSelectionMenu = () => {
        const options = [];
        // console.log("createSelectionMenu for: ", currentCategory, name);
        //const dictationsByCategory =  dictations.filter(dict =>  dict.category=== currentCategory);
        for (let i=0; i< dictations.length; i++) {
            if ( dictations[i].category.startsWith(name) /*dictations[i].category === name*/) { // NB! no levels for now!, _leve1 etc are ignored
                options.push( { value: i, text: dictations[i].title  } );
            }
        }

        return (name.includes("random") || !exerciseHasBegun) ? null :  (
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


    return (
        <div>
            <h2 size='large'>{`${capitalizeFirst( t(name) )} ${selectedDictation.title} `}</h2>
            <h3><i>NB! Notatsioonimoodul läheb ümberkirjutamisele kohati inotatsiooniprobleemid lahenevad.</i></h3>

            { csound === null ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : (
            <Grid celled={false}>
                <ScoreRow/>
                {createSelectionMenu()}
                {createDegreeDictationInput()}
                {createCorrectNotationBlock()}
                {/*{createVolumeRow()}*/}
                { exerciseHasBegun && <VolumeRow /> }
                {createControlButtons()}
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

export default AskDegreeDictation;