import React, {useState, useRef, useEffect} from 'react';
import {Button, Grid, Header, Input, Label, Popup} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {capitalizeFirst, weightedRandom} from "../util/util";
import {getNoteByName, parseLilypondString} from "../util/notes";
//import MIDISounds from 'midi-sounds-react';
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import ScoreRow from "./ScoreRow";
import Notation from "./notation/Notation";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import Sound from 'react-sound';
import Select from "semantic-ui-react/dist/commonjs/addons/Select";
import dictation1a from "../sounds/dictations/1a.mp3";
import {useParams} from "react-router-dom";
import CsoundObj from "@kunstmusik/csound";
import {makeInterval,  scaleDefinitions} from "../util/intervals";
import * as notes from "../util/notes";
import { stringToIntArray, getRandomInt, getRandomBoolean, getRandomElementFromArray } from "../util/util.js"
import {dictationOrchestra as orc} from "../csound/orchestras";
import {dictations as oneVoice} from "../dictations/1voice";
import {dictations as twoVoice} from "../dictations/2voice";
import {dictations as popJazz} from "../dictations/popJazz";
import {dictations as degrees} from "../dictations/degrees";


const AskDictation = () => {
    const { name } = useParams();


    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // const name = useSelector(state => state.exerciseReducer.name);
    //const midiSounds = useRef(null);

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [selectedDictation, setSelectedDictation] = useState({title:"", soundFile:"", notation:""});
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [currentCategory, setCurrentCategory] = useState("C_simple");

    const [notesEnteredByUser, setNotesEnteredByUser] = useState("");
    const [degreesEnteredByUser, setDegreesEnteredByUser] = useState("");

    const [notationInfo, setNotationInfo] = useState({  clef:"treble", time: "4/4", vtNotes: "" });
    const [correctNotation, setCorrectNotation] = useState({  clef:"treble", time: "4/4", vtNotes: "" });

    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);

    //test:
    const [responseStaves, setResponseStaves] = useState(null);
    const [correctStaves, setCorrectStaves] = useState(null);




    // diktaatide definitsioonid võibolla eraldi failis.
    // kas notatsioon Lilypond või VT? pigem lilypond sest import musicXML-st lihtsam
    // vaja mõelda, milliline oleks diktaadifailide struktuur
    // midagi sellist nagu:
    // category: C-  classical, RM - rhythm music (pop-jazz) NB! categorys will most likely change!
    const categories = ["1voice", "2voice", "classical", "popJazz", "functional", "C_simple", "RM_simple", "degrees"];

    const dictationType = name.toString().split("_")[0]; // categories come in as 1voice_level1 etc

    const dictations = oneVoice.concat(twoVoice).concat(degrees).concat(popJazz); // + add other dictations when done


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

        //const firstInCategory = dictations.findIndex(  dict =>  dict.category=== name);
        //renew(firstInCategory);
    };


    const renew = (dictationIndex) => {
        console.log("Renew: ", dictationIndex);
        setAnswered(false);
        setNotesEnteredByUser("");
        setDegreesEnteredByUser("");
        hideAnswer();

        let dictation;

        if (!name.includes("random")) {
            dictation = dictations[dictationIndex];
        }

        let answer = null;

        if (dictationType === "degrees") { // degree dictations -  generate notation from dictation.degrees
            // TODO: take tonicVtNote form given array major: [C, G, F ], minor: [a, e, d] etc

            if ( name.includes("degrees_random")) {
                dictation = generateDegreeDictation();
                console.log("new dictation: ", dictation.degrees, dictation.scale, dictation.tonicVtNote);
            }

            const {vtString, midiNotes} = degreesToNotes(dictation.degrees, dictation.scale, dictation.tonicVtNote);
            console.log("Constructed notation: ", vtString);
            dictation.notation = vtString;
            dictation.midiNotes = midiNotes;
            answer = {degrees: stringToIntArray(dictation.degrees) };
        } else { // other, notation oriented dictations
            // uncommented for testing:
            showFirstNote(dictationIndex);
            hideAnswer();
            answer = {notation: selectedDictation.notation};
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

        return { title: "generated",
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
                if (degree < -7 || degree > 7  ) {
                    console.log("Wrong degree: ", degree);
                    break;
                }
                const interval = scaleDefinitions[scale][Math.abs(degree)-1];
                if (interval) {
                    let note =  makeInterval(baseNote, interval, "up"); // what if bass clef?
                    if (note) {
                        if (degree<0) { // below tonic
                            note =  makeInterval(note, "p8", "down");
                        }
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

    const showFirstNote= (dictationIndex) => {

        // must be rewritten -  sometimes notation is Ly, sometimes VT
        /*const notation =  parseLilypondString(dictations[dictationIndex].notation);
        const vtNotes = notation.vtNotes;
        const firstNote = vtNotes.slice(0, vtNotes.indexOf("/")+2);
        console.log("First note: ", firstNote );
        notation.vtNotes = firstNote;*/
        const notation = { vtNotes:"" }
        setNotationInfo(notation);
        //TODO: peaks sisestama ka taktimõõdu, helistiku ja esimese noodi sisestus-Inputi tekstiks ( notesEnteredByUser )

    };

    const hideAnswer = () => {
        setCorrectNotation({vtNotes: null});
    };

    // võibolla -  ka helifailide mängimine Csoundiga?
    const play = (dictation) => {
        console.log("***Stop***");
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
        console.log("Play soundfile", url);
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
        console.log("***Stop***");
        if (name.toString().startsWith("degrees")) {
            if (csound) {
                csound.readScore("i \"Stop\" 0  0.01");
            }
        } else {
            setPlayStatus(Sound.status.STOPPED);
        }
    };

    const answerIsHidden = () => {
        return correctNotation.vtNotes === null || correctNotation.vtNotes === "";
    };

    const showDictation = () => {
        if (selectedDictation.notation.length === 0 ) {
            alert( t("chooseDictation"));
            return;
        }
        // võibolla -  mitte lubada näidata, kui pole veel vastatud
        // või isegi ainult "Vasta" nupp näitab õiget diktaati
        if (!answerIsHidden()) {
            hideAnswer()
        } else {
            let notationInfo =  {vtNotes: ""};
            // see on paha struktuur, oleks vaja, et oleks võimalik anda kogu vexTab String tervikuna, kui nt mitmehäälne muusika
            if (selectedDictation.notation.trim().startsWith("stave") ) {
                notationInfo.vtNotes = selectedDictation.notation;
            } else {
                notationInfo = parseLilypondString(selectedDictation.notation);
            }

            console.log("Õiged noodid: ", notationInfo.vtNotes);
            if (notationInfo.vtNotes) {
                setCorrectNotation(notationInfo);
            }
            //test: checkresponse should call this, not vice versa
            checkResponse(null);
        }
    };

    const renderNotes = () => {
        const notationInfo = parseLilypondString(notesEnteredByUser);//  noteStringToVexTabChord(notesEnteredByUser);
        setNotationInfo(notationInfo);
        //setVexTabNotes(notationInfo.vtNotes);
    };



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

        if (dictationType === "degrees" ) {
            const responseArray = response.degrees;
            const correctArray = answer.degrees;

            for (let i=0; i<correctArray.length; i++ ) {
                if (Math.abs(responseArray[i]) !== Math.abs(correctArray[i]) ) { // ignore minus signs
                    // TODO: form feedBack string, colour wrong degrees
                    console.log("Wrong degree: ", i, responseArray[i]);
                    correct = false;
                }
            }

            showDictation();
        } else { // all other dictations are with note input
            //showDictation(); // display the dictation first, this should set the CorrectNotation, but that will be too late...
            // NB! this should be the other way round -  button calls checkresponse, checkResponse showNotation
            // What takes care of marking wrong notes?

            //test: staves should be passed via setResponseStaves from Notation
            console.log("STAVES in checkresponse: ", responseStaves);
            console.log("STAVES of correctNotation in checkresponse: ", correctStaves);
            for (let stave of responseStaves ) { // can be two-voiced
                //TODO (tarmo): check that the number of staves is equal between correctNotation and response
                for (let note of stave.note_notes) {
                    console.log("STAVE keys from note :", note.keys);
                }
            }

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
        console.log("Csound effect 1");
        if (csound === null) {  // if you go back to main menu and enter again, then stays "Loading"
            CsoundObj.initialize().then(() => { // ... and error happens here
                const cs = new CsoundObj(); // : Module.arguments has been replaced with plain arguments_ etc
                setCsound(cs);
            });
        } /*else { // tried to have the second effect here, but resets sometimes too early...
            csound.reset();
        }*/
    }, [csound]);

    useEffect(() => {
        console.log("Csound effect 2");
        return () => {
            if (csound) {
                csound.reset();
            }
        }
    }, [csound]);

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
        console.log("Begun: ", exerciseHasBegun);

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
                    <Grid.Column>
                        <Button className={"fullWidth marginTopSmall"}
                                onClick={() => showDictation()  /*checkResponse({userInput:"c d e" })*/}>{capitalizeFirst(t("show"))}
                        </Button>
                    </Grid.Column>
                    {/*Järgnev nupp peaks olema nähtav ainult diktaadiharjutuste puhul: */}
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

    const checkDegrees = () => checkResponse( {degrees: stringToIntArray(degreesEnteredByUser) } );


    const createDegreeDictationInput = () => { // if degreedictation, Input for  degrees (text), otherwise lilypondINpute + Notation
        return (exerciseHasBegun && dictationType==="degrees") ? (
            <div>
                <label className={"marginRight"}>{  capitalizeFirst( t("enterDegrees") ) + " " }
                    {name.includes("random") ? t("inMode") : ""} <b>{ t(selectedDictation.scale) }</b>: </label>
                <Input
                    className={"marginRight"}
                    onChange={e => {  setDegreesEnteredByUser(e.target.value) } }
                    onKeyPress={ e=> { if (e.key === 'Enter') checkDegrees()  } }
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
        return (exerciseHasBegun && dictationType!=="degrees") ? (
            <div className={'notationBlock'}>
                <Input
                    className={"marginRight"}
                    onChange={e => {setNotesEnteredByUser(e.target.value)}}
                    onKeyPress={ e=> { if (e.key === 'Enter') renderNotes()  }}
                    placeholder={'nt: \\time 3/4 a,8 h, c4 gis | a a\'2'}
                    value={notesEnteredByUser}
                />
                <Button onClick={renderNotes}>{ capitalizeFirst( t("render") )}</Button>
                {/*AJUTINE INFO kast:*/}
                <Popup on='click' position='bottom right' trigger={<Button content='Juhised' />} >
                    <h3>Noteerimine teksti abil</h3>
                    <p>Noodinimed: b, h, c, cis, es, fisis jne.</p>
                    <p>Oktav (ajutine) noodinime järel: , - väike oktav, ' - teine oktav, Ilma märgita -  1. oktav </p>
                    <p>Vältused noodinime (ja oktavi) järel: 4 -  veerad, 4. -  veerand punktida, 8 - kaheksandik jne.
                        Vaikimisi -  veerand. Kui vätlus kordub, pole vaja seda kirjutada</p>
                    <p>Paus: r </p>
                    <p>Taktijoon: | </p>
                    <p>Võti: nt. <i>{'\\clef treble'}</i> või <i>{'\\clef bass'}</i></p>
                    <p>Taktimõõt: <i>nt. {'\\time 2/4 \\time 4/4 \\time 3/8'}</i> </p>
                    <p>Helistik: hetkel toetamata</p>
                    <p>Näide: Rongisõit B-duuris:</p>
                    <p> { '\\time 2/4 b,8 c d es | f f f4  ' }  </p>

                </Popup>

                <Notation  className={"marginTopSmall"} width={600} scale={1}
                           notes={notationInfo.vtNotes}
                           time={notationInfo.time}
                           clef={notationInfo.clef}
                           keySignature={notationInfo.keySignature}
                           showInput={true}
                           passStaves={setResponseStaves}
                />

            </div>
        ) : null;
    };


    const createCorrectNotationBlock = () => {
        const answerDisplay = answerIsHidden() ? "none" : "inline";

        return exerciseHasBegun ? (

            <div style={{display: answerDisplay}}>
               <Notation className={"marginTopSmall"} width={600} scale={1}
                         notes={correctNotation.vtNotes}
                         time={correctNotation.time}
                         clef={correctNotation.clef}
                         keySignature={correctNotation.keySignature}
                         showInput={false}
                         /*passStaves={setCorrectStaves}*/
               />

            </div>
        ) : null;
    };

    const createSelectionMenu = () => {
        const options = [];
        console.log("createSelectionMenu for: ", currentCategory, name);
        //const dictationsByCategory =  dictations.filter(dict =>  dict.category=== currentCategory);
        for (let i=0; i< dictations.length; i++) {
            if ( dictations[i].category.startsWith(name) /*dictations[i].category === name*/) { // NB! no levels for now!, _leve1 etc are ignored
                options.push( { value: i, text: dictations[i].title  } );
            }
        }

        return name.includes("random") ? null :  (
            <Grid.Row>
                <Grid.Column>
            <Select
                className={"marginTopSmall fullwidth"}
                placeholder={t("chooseDictation")}
                options={options}
                /*defaultValue={options[0].soundFile}*/
                onChange={(e, {value}) => {
                    if (!exerciseHasBegun) {
                        startExercise();
                    }
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