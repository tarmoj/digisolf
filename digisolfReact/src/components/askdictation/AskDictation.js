import React, {useState, useEffect} from 'react';
import {Button, Dropdown, Grid, Header, Input, Label, Popup} from 'semantic-ui-react'
import {Slider} from "react-semantic-ui-range";

import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {arraysAreEqual, capitalizeFirst, deepClone, weightedRandom} from "../../util/util";
import {parseLilypondString, parseLilypondDictation} from "../../util/notes";
//import MIDISounds from 'midi-sounds-react';
import {setNegativeMessage, setPositiveMessage} from "../../actions/headerMessage";
import ScoreRow from "../ScoreRow";
import Notation from "../notation/Notation";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../../actions/score";
import GoBackToMainMenuBtn from "../GoBackToMainMenuBtn";
import Sound from 'react-sound';
import Select from "semantic-ui-react/dist/commonjs/addons/Select";
import {useParams} from "react-router-dom";
import CsoundObj from "@kunstmusik/csound";
import {makeInterval,  scaleDefinitions, getIntervalByShortName} from "../../util/intervals";
import * as notes from "../../util/notes";
import {stringToIntArray, getRandomElementFromArray } from "../../util/util.js"
import {dictationOrchestra as orc} from "../../csound/orchestras";
import {dictations as oneVoice} from "../../dictations/1voice";
import {dictations as twoVoice} from "../../dictations/2voice";
import {dictations as popJazz} from "../../dictations/popJazz";
import {dictations as degrees} from "../../dictations/degrees";
import {dictations as classical} from "../../dictations/classical"
//import * as constants from "./dictationConstants";
import {resetState, setAllowInput, setCorrectNotation, setInputNotation} from "../../actions/askDictation";


const AskDictation = () => {
    const { name } = useParams();

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const defaultNotationInfo = {  clef:"treble", time: "4/4", vtNotes: "" };

    // const name = useSelector(state => state.exerciseReducer.name);
    //const midiSounds = useRef(null);

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [selectedDictation, setSelectedDictation] = useState({title:"", soundFile:"", notation:""});
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [showCorrectNotation, setShowCorrectNotation] =  useState(false);

    const [notesEnteredByUser, setNotesEnteredByUser] = useState("");
    const [degreesEnteredByUser, setDegreesEnteredByUser] = useState("");

    const [notationInfo, setNotationInfo] = useState(defaultNotationInfo); // do we need it?

    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
    const [wrongNoteIndexes, setWrongNoteIndexes] = useState(null);
    const [volume, setVolume] = useState(0.6);
    //const [inputVtString, setInputVtString] = useState( "stave time=4/4\n");
    const [correctVtString, setCorrectVtString] = useState( "stave time=4/4\n");


    useEffect(() => {
        dispatch(resetState());
    }, []);

    const dictationType = name.toString().split("_")[0]; // categories come in as 1voice_level1 etc

    const dictations = oneVoice.concat(twoVoice).concat(degrees).concat(popJazz).concat(classical); // + add other dictations when done

    const inputNotation = useSelector(state => state.askDictationReducer.inputNotation);
    const correctNotation = useSelector(state => state.askDictationReducer.correctNotation);
    const allowInput = useSelector(state => state.askDictationReducer.allowInput);

    //temporary test for degree dictation, to pass the notation as string:


    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);

        if ( dictationType === "degrees" ) {
            if (!csoundStarted) {
                startCsound();
            }
        }

        if (name.includes("random")) {
            renew(0);
        }

    };


    const renew = (dictationIndex) => {
        console.log("Renew: ", dictationIndex);
        setAnswered(false);
        setNotesEnteredByUser("");
        setDegreesEnteredByUser("");
        //hideAnswer();
        setShowCorrectNotation(false);
        setWrongNoteIndexes(null);

        let dictation;

        if (!name.includes("random")) {
            dictation = dictations[dictationIndex];
        }

        let answer = null;

        if (dictationType === "degrees") { // degree dictations -  generate notation from dictation.degrees

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
        } else {
            answer = {notation: selectedDictation.notation}; // <- this will not be used
            const notationInfo = parseLilypondDictation(dictation.notation);
            console.log("notationInfo: ", notationInfo);
            dispatch(setCorrectNotation(notationInfo));
            showFirstNote(dictation);

        }

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
        const possibleTonicNotes = ["G/4", "A/4", "C/5", "D/5"];
        const possibleScales = ["major", "minorNatural", "minorHarmonic"]; // maybe scale should be given as a parameter
        const possibleDegrees = [-5, -6, -7, 1, 2, 3, 4, 5, 6];
        const maxNotes = 7;

        let degrees = [];

        const firstNoteProbabilities = { 1:0.6, 3:0.2, 5:0.1, 2:0.1 };
        const followUpProbabilities = { // probabilities, what comes after the given degree
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

        degrees[0] =  parseInt( weightedRandom(firstNoteProbabilities) );
        let lastIndex = possibleDegrees.indexOf(degrees[0]);
        console.log("First note: ", degrees[0]);


        // try wiht most probable intervals -  did not work well
        // const intervalProbabilities = {1:0.5, 2:0.25, 3:0.1, 4:0.1, 5:0.05}; // interval in degrees

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
                        vtString += ` ${note.vtNote}  $ ${Math.abs(degree) } $ `; // add the
                        if (counter%4 == 0) {
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
            vtString += " ## =|= "
            return {vtString: vtString, midiNotes: midiNotes};
        } else {
            console.log("Could not find scale: ", scale );
            return {vtString: "", midiNotes: []};
        }
    };



    // võibolla -  ka helifailide mängimine Csoundiga?
    const play = (dictation) => {
        stop(); // need a stop here  - take care, that it does not kill already started event
        if (dictationType === "degrees") {
            const beatLength = 1.2;
            playTonic(dictation.tonicVtNote, 1*beatLength, 0.1);
            playCsoundSequence(dictation, 2*beatLength+0.1, beatLength );
        } else {
            playSoundFile(dictation.soundFile);
        }
    };

    const playSoundFile = (url) => { // why is here url? Sound.url is probably already set somewhere...
        // console.log("Play soundfile", url);
        setPlayStatus(Sound.status.PLAYING);
    };

    const playTonic = (tonicVtNote=0, duration=1, when=0) => {
        const midiNote = notes.getNoteByVtNote(tonicVtNote).midiNote;
        const scoreLine = `i 2 ${when} ${duration} ${midiNote}`;
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
        if (name.toString().startsWith("degrees")) {
            if (csound) {
                csound.readScore("i \"Stop\" 0  0.01");
            }
        } else {
            setPlayStatus(Sound.status.STOPPED);
        }
    };

    // some dictation may have property show (in lilypond), if not, copy stave definitions and stave's first notes to inputNotation
    // TODO: this does not work on first call from renew, probably since Notation and its vexTab are not created yet...
    const showFirstNote= (dictation) => {
        if (dictation.hasOwnProperty("show")) {
            const notationInfo = parseLilypondDictation(dictation.show);
            dispatch( setInputNotation(notationInfo));
        } else {
            let notationInfo = parseLilypondDictation(dictation.notation);
            if (notationInfo.staves.length>=1) {
                for (let stave of notationInfo.staves) {
                    for (let voice of stave.voices) {
                        voice.notes.splice(1); // leave only the first note
                        //console.log("remaining notes: ", voice.notes);
                    }
                }
                dispatch( setInputNotation(notationInfo)); // or this arrives Notation one render cycle too late (ie dictation shows the note of previous one
            } else {
                console.log("No staves in correctNotation");
            }

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
        if (showCorrectNotation) {
            setWrongNoteIndexes(null);
        }
    };

    const renderNotes = () => {
        //const notationInfo = parseLilypondString(notesEnteredByUser);//  noteStringToVexTabChord(notesEnteredByUser);
        //setNotationInfo(notationInfo);
    };

    const checkDegrees = () => checkResponse( {degrees: stringToIntArray(degreesEnteredByUser) } );

    const checkDegreesResponse = (degrees) => {
        let correct = true;
        const correctArray = answer.degrees;

        for (let i=0; i<correctArray.length; i++ ) {
            if (Math.abs(degrees[i]) !== Math.abs(correctArray[i]) ) { // ignore minus signs
                // TODO: form feedBack string, colour wrong degrees
                console.log("Wrong degree: ", i, degrees[i]);
                correct = false;
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

        let feedBack = "";
        let correct = true;

        if (dictationType === "degrees" ) {
            correct = checkDegreesResponse(response.degrees); // Tarmo: not sure if different function makes sense -  more difficult to form the feedback in future
        } else { // all other dictations are with note input
            let incorrectNotes = [];

            // tarmo: NB! temporary! until two-stave input is not supported. Later take care that  there is two input staves for 2voice dictations
            if (inputNotation.staves.length < correctNotation.staves.length ) {
                console.log("Too few input staves!");
                showDictation();
                return;
            }

            for (let i = 0, n = correctNotation.staves.length; i < n; i++) {
                for (let j = 0, n = correctNotation.staves[i].voices.length; j < n; j++) {
                    for (let k = 0, n = correctNotation.staves[i].voices[j].notes.length; k < n - 1; k++) { // Skip end barline
                        if (!inputNotation.staves[i].voices[j].notes[k] || !arraysAreEqual(correctNotation.staves[i].voices[j].notes[k].keys, inputNotation.staves[i].voices[j].notes[k].keys)) {
                            incorrectNotes.push({
                                staveIndex: i,
                                voiceIndex: j,
                                noteIndex: k
                            });
                        }
                    }
                }
            }

            setWrongNoteIndexes(incorrectNotes);
            showDictation();
        }



        /*if (checkNotation()) {
            feedBack += `${capitalizeFirst(t("notation"))} ${t("correct")}. `;
            correct = true;
        } else {
            feedBack += capitalizeFirst(t("notation")) + " " + t("wrong") + ". ";
            correct = false;
        }*/

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
        if (csound === null) {  // if you go back to main menu and enter again, then stays "Loading"
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

    // useEffect(() => {
    //     // console.log("Csound effect 2");
    //     return () => {
    //         if (csound) {
    //             csound.reset();
    //         }
    //     }
    // }, [csound]);

    async function loadResources(csound,  startinNote=60, endingNote=84, instrument="flute") {
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
            // const path = `/${dirToSave}/${fName}`;
            const path = `${fName}`;
            const buffer = await f.arrayBuffer();
            // console.log(path, buffer);
            await csound.writeToFS(path, buffer);
        }
        return true;
    }

    const startCsound = async () => {
        console.error('start csound')
        if (csound) {
            await loadResources(csound, 60, 84, "flute");

            csound.setOption("-m0d")
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
                        <Button color={"green"} onClick={() => play(selectedDictation)} className={"fullWidth marginTopSmall"} >
                            { capitalizeFirst( t("play")) }
                        </Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => stop()} className={"fullWidth marginTopSmall"}  >{ capitalizeFirst( t("stop") )}</Button>
                    </Grid.Column>
                    { dictationType!=="degrees" && <Grid.Column>
                         <Button className={"fullWidth marginTopSmall"}
                                onClick={() => /*showDictation()*/  checkResponse(null)}>{capitalizeFirst(t("check"))}
                        </Button>
                    </Grid.Column> }
                    {/*Järgnev nupp peaks olema nähtav ainult diktaadiharjutuste puhul:  - kirjuta ümber: dictationType==="degrees" && ... */}
                    {createRenewButton()}
                    {createTonicButton()}

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
        return (exerciseHasBegun && dictationType==="degrees")  ? (
            <Grid.Row centered={true} columns={3}>
                <Grid.Column>
                    {capitalizeFirst(t("instrument"))+": "}
                    <Dropdown
                        placeholder={capitalizeFirst(t("sound"))}
                        onChange={ async (event, data) => {
                            console.log("New sound is: ", data.value)
                            if (csound) {
                                await loadResources(csound,  60, 84, data.value);
                            }
                        }
                        }
                        options ={ [
                            {text: t("flute"), value:"flute"},
                            {text: t("oboe"), value:"oboe"},
                            {text: t("violin"), value:"violin"}
                            ]  }
                        defaultValue={0}
                    />
                </Grid.Column>

                <Grid.Column>
                    {capitalizeFirst(t("volume"))}
                    <Slider value={volume} color="blue"
                            settings={ {
                                min:0, max:1, step:0.01,
                                start: {volume},
                                onChange: (value) => {
                                    if (csound) {
                                        csound.setControlChannel("volume", value);
                                    }
                                    setVolume(value);
                                }
                            } }
                    />
                </Grid.Column>
                <Grid.Column />
            </Grid.Row>
        ) : null;
    };

    const createDegreeDictationInput = () => { // if degreedictation, Input for  degrees (text), otherwise lilypondINpute + Notation
        return (exerciseHasBegun && dictationType==="degrees") ? (
            <div>
                <label className={"marginRight"}>{  capitalizeFirst( t("enterDegrees") ) + " " }
                    {name.includes("random") ? t("inMode") : ""} <b>{ t(selectedDictation.scale) }</b>: </label>
                <Input
                    className={"marginRight"}
                    onChange={e => {  setDegreesEnteredByUser(e.target.value) } }
                    onKeyPress={ e=> {

                        /*if (['0','1','2','3','4','5','6','7','8'].includes(e.key)) { // does not work on android chrome
                            console.log("this is a number key", e.key);
                            setDegreesEnteredByUser(degreesEnteredByUser + " "+ e.key);
                        } else*/ if (e.key === 'Enter') {
                            checkDegrees();
                        }
                    }
                    }
                    placeholder={'nt: 1 3 2 4 7 1'}
                    value={degreesEnteredByUser}
                />

                <Button onClick={ checkDegrees }>{ capitalizeFirst( t("answer") )}</Button>

            </div>
        ) : null;

    };

    const createTonicButton = () => {
        return (exerciseHasBegun && dictationType==="degrees") ? (
            <Grid.Column>
                <Button className={"fullWidth marginTopSmall"}
                        onClick={() => playTonic(selectedDictation.tonicVtNote)}>{capitalizeFirst(t("tonic"))}
                </Button>
            </Grid.Column>
        ) : null;
    };

    const createRenewButton = () => {
        return (exerciseHasBegun && name.toString().startsWith("degrees_random")) ? (
            <Grid.Column>
                <Button className={"fullWidth marginTopSmall"}
                        onClick={() => renew(0)}>{capitalizeFirst(t("new"))}
                </Button>
            </Grid.Column>
        ) : null;
    };

    const createNotationInputBlock =  () => {
        if (exerciseHasBegun && dictationType!=="degrees" && selectedDictation.title !== "") {
            return (
                <Notation  className={"marginTopSmall"}
                           scale={1}
                           notes={notationInfo.vtNotes} // this makes little sense, rework
                    /*time={notationInfo.time}
                    clef={notationInfo.clef}
                    keySignature={notationInfo.keySignature}*/
                           showInput={true}
                           wrongNoteIndexes={wrongNoteIndexes}
                           name={"inputNotation"}
                           width={getWidth(correctNotation)}
                />
            )
        }
    };

    const createCorrectNotationBlock = () => {
        if (exerciseHasBegun && selectedDictation.title !== "" && showCorrectNotation) {
            return (
                <Notation className={"marginTopSmall center"}
                          scale={1}
                          notes={correctNotation} // this has no meaning in degree dictations
                          vtString={correctVtString}
                          /*time={correctNotation.time}
                          clef={correctNotation.clef}
                          keySignature={correctNotation.keySignature}*/
                          showInput={false}
                          name={"correctNotation"}
                          width={getWidth(correctNotation)}
                />
            )
        }
    };

    const getWidth = () => {
        return  Math.max( correctNotation.staves[0].voices[0].notes.length * 40, 600);
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
            <Grid.Row>
                <Grid.Column>
            <Select
                className={"marginTopSmall fullwidth"}
                placeholder={t("chooseDictation")}
                options={options}
                /*defaultValue={options[0].soundFile}*/
                onChange={(e, {value}) => {
                    // if (!exerciseHasBegun) {
                    //     startExercise();
                    // }
                    dispatch(resetState());
                    dispatch(setAllowInput(true));
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
            <Header size='large'>{`${capitalizeFirst( t(name) )} ${selectedDictation.title} `}</Header>

            <Sound
                url={selectedDictation.soundFile}
                volume={volume*100}
                loop={false}
                playStatus={playStatus}
                onFinishedPlaying={handleDictationFinishedPlaying}
            />

            { csound === null ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : (
            <Grid>
                <ScoreRow/>
                {createSelectionMenu()}
                {createDegreeDictationInput()}
                {createNotationInputBlock()}
                {createCorrectNotationBlock()}
                {createVolumeRow()}
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

export default AskDictation;