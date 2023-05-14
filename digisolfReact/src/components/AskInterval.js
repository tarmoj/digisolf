import React, {useState, useRef, useEffect} from 'react';
//import {Grid} from 'semantic-ui-react'
import {
    Button,
    TextField,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    FormControlLabel, Checkbox
} from "@material-ui/core"
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {getNoteByVtNote} from "../util/notes";
import {
    getRandomElementFromArray,
    getRandomBoolean,
    capitalizeFirst,
    isDigit,
    getRandomInt,
} from "../util/util";
import {
    getInterval,
    getIntervalByShortName,
    makeScale,
    simplifyIfAugmentedIntervals
} from "../util/intervals";
//import MIDISounds from 'midi-sounds-react';
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import ScoreRow from "./ScoreRow";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import { useParams } from "react-router-dom";
import { useHotkeys } from 'react-hotkeys-hook';
import * as Tone from "tone"
import {setIsLoading, setSettingsMenuOpen} from "../actions/component";
import VolumeRow from "./VolumeRow";
import {setCustomMenu} from "../actions/component";


const AskInterval = () => {
    const { exerciseName, parameters } = useParams();
    // parameters can be in form count=1&intervals=v2.s3.p4&mode=melodicHamonic
    // put parameters into object
    const parameterDict = {};
    if (parameters) {
        // snippet from: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
        parameters.split("+").forEach(function(item) {parameterDict[item.split("=")[0]] = item.split("=")[1]});
        //console.log("parameters: ", parameterDict);
    }
    const [intervalCount, setIntervalCount] = useState(  isDigit(parameterDict.count) ? parseInt(parameterDict.count) : (parseInt(localStorage.getItem("intervalCount")) || 1) );

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const VISupportMode = useSelector(state => state.exerciseReducer.VISupportMode);
    const masterVolume = useSelector(state => state.exerciseReducer.volume);

    const startButtonRef = useRef(null);

    //const midiSounds = useRef(null);

    const [isMajor, setIsMajor] = useState(true);
    const [selectedTonicNote, setSelectedTonicNote] = useState(null);
    const [greenIntervalButtons, setGreenIntervalButtons] = useState([]);
    const [redIntervalButtons, setRedIntervalButtons] = useState([]);
    const [correctIntervalButtons, setCorrectIntervalButtons] = useState([]);
    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [intervalData, setIntervalData] = useState([{degrees:[], notes:[], interval: null}]); //array of: {degrees: []}
    const [degreesEnteredByUser, setDegreesEnteredByUser] = useState(Array(intervalCount));
    const [possibleIntervalShortNames, setPossibleIntervalShortNames] = useState([]);
    const [activeIntervals, setActiveIntervals] = useState([]); // necessary for interval selction by user
    const [currentResponseIndex, setCurrentResponseIndex] = useState(0); // in case there are several intervals
    const [response, setResponse] = useState( Array(intervalCount)); //.fill({degrees:[], intervalShortName:""}));
    const [mode, setMode] = useState(localStorage.getItem("intervalPlayMode")) ; // melodic|harmonic|melodicHarmonic
    const [sampler, setSampler] = useState(null );
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showIntervalSelection, setShowIntervalSelection] = useState(false);


    const instrument = useSelector(state => state.exerciseReducer.instrument);
    const bassInstruments =  ["trombone", "cello", "bassoon"]; // NB! update when new instruments are added.



    useEffect( () => {
        document.title = `${t("setInterval")} - ${t(exerciseName)}`;
        startButtonRef.current.focus(); // seems that works here... but not the exercises with Csound or option menun
        createCustomMenu();
    }, []); // set title for screen reader


    useEffect(() => {
        setSampler(createSampler(instrument)); // take care if this is the default of instrumentSelection
    }, [instrument]);


    const possibleTonicVtNotes = ["C/4", "D/4",  "E@/4", "E/4", "F/4",
        "G/4", "A/4", "B@/4", "C/5" ];

    // ----- shortcuts -----
    useHotkeys('shift+left', () => {console.log("Backodroom"); /* how to call goBack() from GoBackMnu Button? */}, [exerciseHasBegun, intervalData]); // call somehow GoBackBtn onClick function
    useHotkeys('shift+right', () => {
        console.log("Next", exerciseHasBegun);
        if (exerciseHasBegun) {
            renew();
        }
    }, [exerciseHasBegun]);
    useHotkeys('shift+enter', () => {console.log("Start exercise"); startExercise() }, [exerciseHasBegun]);
    useHotkeys('shift+down', () => {  // repeat
        if (exerciseHasBegun) {
            play(intervalData);
        }
    }, [exerciseHasBegun, intervalData]);
    useHotkeys('shift+up', () => {  // change key
        if (exerciseHasBegun) {
            changeKey();
        }
    }, [exerciseHasBegun]);
    //TODO: play tonic, changeKey



    // -------


    const startExercise = () => {
        if (exerciseName === "randomInterval") { // if interval not in key, set possible intervals:
            let possibleIntervalShortNames = [];
            if (parameterDict.intervals) {
                if (parameterDict.intervals.includes(".")) { // allow giving the interval names (via shortName) as name via URL like /M.m.M6.m6
                    //console.log("Extract possible intervals from name: ");
                    // filter out elements that now interval can be found with
                    possibleIntervalShortNames = parameterDict.intervals.split(".").filter(shortName => getIntervalByShortName(shortName));
                    console.log(possibleIntervalShortNames);
                }
            }else {
                possibleIntervalShortNames = ["v2", "s2", "v3", "s3", "p4", ">5", "p5", "v6", "s6", "v7", "s7", "p8"];
            }
            setPossibleIntervalShortNames(possibleIntervalShortNames);
            setActiveIntervals(possibleIntervalShortNames);
            renewRandom(possibleIntervalShortNames); // don't play automatically

        } else { // intervals in key
            changeKey(); // calls also renewInKey() // we want to change key but not to play one yet...
        }
        setExerciseHasBegun(true);;
    };




    const changeKey = () => {
        let tonicNote = selectedTonicNote; // to select different  from previous
        const isMajor = getRandomBoolean();

        while (tonicNote === selectedTonicNote) {
            tonicNote = getNoteByVtNote(getRandomElementFromArray(possibleTonicVtNotes));
        }
        console.log("isMajor, new tonic note is: ", isMajor, tonicNote.vtNote );

        setSelectedTonicNote(tonicNote);
        setIsMajor(isMajor);
        sampler.releaseAll();
        //midiSounds.current.cancelQueue();
        const triadDuration = 1.5;
        playTonicTriad(tonicNote.midiNote, isMajor, triadDuration);
        setTimeout( ()=>renewInKey(isMajor, tonicNote), triadDuration*1000 + 300 ) ; // new exercise after the chord, but not in the beginniing
    }

    const renew = () => {
        setResponse(Array(intervalCount));
        setDegreesEnteredByUser(Array(intervalCount));
        setGreenIntervalButtons([]);
        setRedIntervalButtons([]);
        setCorrectIntervalButtons([]);
        setAnswered(false);

        setCurrentResponseIndex(0);
        stopSound();
        //midiSounds.current.cancelQueue();

        if (activeIntervals.length===0) {
            alert(capitalizeFirst(t("selectSomeInterval")));
            return;
        }

        if (exerciseName.includes("random")) {
            renewRandom(activeIntervals);
        } else {
            renewInKey(isMajor, selectedTonicNote);
        }
    }

    const renewInKey = (isMajor, tonicNote) => {

        let possibleDegrees = [];
        let shortNames = [];

        if (exerciseName==="tonicTriad") {
            possibleDegrees = [1,3,5,8];
            shortNames = ["v3","s3","p4", "p5", "v6", "s6", "p8"];

        } else if (exerciseName==="tonicAllScaleDegrees") {
            possibleDegrees = [2,3,4,5,6,7,8];
            shortNames = ["s2", "v3", "s3", "p4", "p5", "v6", "s6", "v7", "s7", "p8"];
        } else if (exerciseName==="allScaleDegrees") {
            possibleDegrees = [1,2,3,4,5,6,7,8];
            shortNames = ["v2", "s2", "v3", "s3", "p4", ">5", "p5", "v6", "s6", "v7", "s7", "p8"];
        } else {
            possibleDegrees = [1,2,3,4,5,6,7,8];
            shortNames = ["v2", "s2", "v3", "s3", "p4", ">5", "p5", "v6", "s6", "v7", "s7", "p8"];
        }

        setPossibleIntervalShortNames( shortNames);
        setActiveIntervals(shortNames);

        const newIntervalData = [];

        for (let i=0; i<intervalCount;i++ ) {
            let data = getIntervalFromScale(isMajor ? "major" : "minor", tonicNote.vtNote, possibleDegrees );
            if (i===0 && intervalData[0]) { // check that the first interval is not the same as previous
                if (JSON.stringify(data) === JSON.stringify(intervalData[0])) {
                    while (JSON.stringify(data) === JSON.stringify(intervalData[0])) {
                        console.log("Same interval as before, take it again");
                        data = getIntervalFromScale(isMajor ? "major" : "minor", tonicNote.vtNote, possibleDegrees );
                    }
                }
            } else if (i>0) {
                while (JSON.stringify(data) === JSON.stringify(newIntervalData[i-1])) {
                   console.log("Same interval, take it again");
                    data = getIntervalFromScale(isMajor ? "major" : "minor", tonicNote.vtNote, possibleDegrees );
                }
            }
            newIntervalData.push(data);
        }
        //console.log("renew got: ", newIntervalData);
        setIntervalData(newIntervalData);
        if (exerciseHasBegun) {
            play(newIntervalData); // do we need to play here?
        }
    }

    const renewRandom = (possibleShortNames) => {
        const newIntervalData = [];
        for (let i=0; i<intervalCount;i++ ) {
            //TODO : check that second data is not the same as first JSON.stingify === ?
            let data = getRandomInterval(possibleShortNames);
            if (i===0 && intervalData[0]) { // check that the first interval is not the same as previous
                if (JSON.stringify(data.interval) === JSON.stringify(intervalData[0])) {
                    while (JSON.stringify(data) === JSON.stringify(intervalData[0])) {
                        //console.log("Same interval as before, take it again");
                        data = getRandomInterval(possibleShortNames);
                    }
                }
            } else if (i>0) {
                while (JSON.stringify(data) === JSON.stringify(newIntervalData[i-1])) {
                    //console.log("Same interval, take it again");
                    data = getRandomInterval(possibleShortNames);
                }
            }
            newIntervalData.push(data);
        }
        setIntervalData(newIntervalData);
        if (exerciseHasBegun) {
            play(newIntervalData);
        }

    }


    const play = (intervalData) => { // intervalData may contain several intervals
        // melodic
        const intervalCount = intervalData.length;

        const noteDuration = intervalCount>1 ? 0.5 : 1 ;
        const chordDuration = 2*noteDuration;
        const pause = 1;
        let start = 0;

        console.log("Mode: ", mode);
        if ( Tone.Transport.state === "started") {
            stopSound();
        }
        //Tone.Transport.start("+0.1");

        if (mode=="melodicHarmonic") {

            if (intervalCount === 1) {
                const midiNote1 = intervalData[0].notes[0].midiNote;
                const midiNote2 = intervalData[0].notes[1].midiNote;
                playNote(midiNote1, start, noteDuration); // melodic - one after another
                playNote(midiNote2, start + noteDuration, noteDuration);
                start += noteDuration * 2 + pause;

                playNote(midiNote1, start, chordDuration); // harmonic - together
                playNote(midiNote2, start, chordDuration);

            } else if (intervalCount > 1) {

                for (let data of intervalData) { // first melodic
                    const midiNote1 = data.notes[0].midiNote;
                    const midiNote2 = data.notes[1].midiNote;
                    //console.log("Midinotes: ", midiNote1, midiNote2);
                    playNote(midiNote1, start, noteDuration); // melodic - one after another
                    playNote(midiNote2, start + noteDuration, noteDuration);

                    start += noteDuration * 2 + pause;
                }

                for (let data of intervalData) {  // then harmonic (together)
                    const midiNote1 = data.notes[0].midiNote;
                    const midiNote2 = data.notes[1].midiNote;
                    playNote(midiNote1, start, chordDuration); // melodic - one after another
                    playNote(midiNote2, start, chordDuration);

                    start += chordDuration + pause;
                }
            }
        } else if (mode==="melodic") {
            if (intervalCount === 1) {
                const midiNote1 = intervalData[0].notes[0].midiNote;
                const midiNote2 = intervalData[0].notes[1].midiNote;
                playNote(midiNote1, start, noteDuration); // melodic - one after another
                playNote(midiNote2, start + noteDuration, noteDuration);
            } else if (intervalCount > 1) {
                for (let data of intervalData) { // first melodic
                    const midiNote1 = data.notes[0].midiNote;
                    const midiNote2 = data.notes[1].midiNote;
                    //console.log("Midinotes: ", midiNote1, midiNote2);
                    playNote(midiNote1, start, noteDuration); // melodic - one after another
                    playNote(midiNote2, start + noteDuration, noteDuration);
                    start += noteDuration * 2 + pause;
                }
            }

        } else { // else harmonic -  notes together
            if (intervalCount === 1) {
                const midiNote1 = intervalData[0].notes[0].midiNote;
                const midiNote2 = intervalData[0].notes[1].midiNote;

                playNote(midiNote1, start, chordDuration); // harmonic - together
                playNote(midiNote2, start, chordDuration);

            } else if (intervalCount > 1) {
                for (let data of intervalData) {  // then harmonic (together)
                    const midiNote1 = data.notes[0].midiNote;
                    const midiNote2 = data.notes[1].midiNote;
                    playNote(midiNote1, start, chordDuration); // melodic - one after another
                    playNote(midiNote2, start, chordDuration);

                    start += chordDuration + pause;
                }
            }
        }
        Tone.Transport.start();

    }

    const getIntervalFromScale = (scale="major", tonicVtNote="C/4", possibleDegrees=[]  ) => {
        const scaleNotes = makeScale(tonicVtNote, scale);
        //console.log(" getIntervalFromScale: degrees ", possibleDegrees);
        let degree1;
        if (exerciseName==="tonicAllScaleDegrees") {
            degree1 = 1;
        } else {
            degree1 = getRandomElementFromArray(possibleDegrees);
        }

        let degree2= degree1;
        while (degree2==degree1) { // not to be the same
            degree2 = getRandomElementFromArray(possibleDegrees);
        }

        
        let degrees = [];
        if (mode==="harmonic" && degree2 < degree1) { // take care that in harmonic mode the smaller degree is always first -  the user cannot know the direction
            degrees = [degree2, degree1];
        } else {
            degrees = [degree1, degree2];
        }
        
        const note1 = getNoteByVtNote(scaleNotes[degrees[0]-1]); // index in the array is degree-1
        const note2 = getNoteByVtNote(scaleNotes[degrees[1]-1]);

        if (degrees[0]===8)  degrees[0]=1; // in theory there is no degree 8, use 1 instead
        if (degrees[1]===8)  degrees[1]=1;

        const intervalInfo = getInterval(note1, note2);
        //console.log("getIntervalFromScale: Degrees, interval: ", degree1, degree2, note1.vtNote, note2.vtNote, intervalInfo.interval.shortName);
        return { degrees:degrees, notes: [note1, note2], interval: intervalInfo.interval }
    };

    const getRandomInterval = (possibleShortNames, index=0) => { // index -  to check which interval we are renewing, if there are several asked

        const    interval = simplifyIfAugmentedIntervals( getIntervalByShortName(getRandomElementFromArray(possibleShortNames)));
        if (!interval) {
            console.log("Failed finding interval");
            return;
        }

        const up = getRandomBoolean(); // direction
        let midiNote1, midiNote2;
        midiNote1 = up ? getRandomInt(60, 80-interval.semitones)  : getRandomInt(60+interval.semitones, 80);
        midiNote2 = up ? midiNote1 + interval.semitones : midiNote1 - interval.semitones;
        console.log("getRandomInterval interval, midinote1, midinote2", interval.shortName, midiNote1, midiNote2, possibleShortNames);

        const data = {interval: interval, notes: [{midiNote:midiNote1}, {midiNote:midiNote2} ]}; // no notenames needed here so far
        return data;

    }



    const playTonicTriad = (rootMidiNote, isMajor, duration) => {

        if ( Tone.Transport.state === "started") {
            stopSound();
        }
        Tone.Transport.start("+0.1");

        const third =  rootMidiNote + ((isMajor) ? 4 : 3);
        const fifth = rootMidiNote + 7;
        // playing melodically (or rather as slow arpeggio)
        const timeInterval = 0.15;
        playNote(rootMidiNote, 0, duration);
        playNote(third, timeInterval, duration - timeInterval);
        playNote(fifth, timeInterval*2, duration - 2*timeInterval);
        //console.log("Tonic notes: ", rootMidiNote, third, fifth);
    }

    // Tone.js for sound

    function fileExists(url) { // does not work, always reports true...
        if(url){
            const req = new XMLHttpRequest();
            req.open('GET', url, false);
            req.send();
            console.log("url OK", url);
            return req.status==200;
        } else {
            console.log("url not OK", url);
            return false;
        }
    }

      const createSampler = (instrument) => {
        dispatch(setIsLoading(true));
        const sampleList = {};
        for (let i=60; i<=84; i++) {
            // rewrite - -> function relativeToRange(notenumber, "instrument");
            const noteNumber = bassInstruments.includes(instrument) ? i-24  : i; // 2 octaves lower for lower samples for lower instruments
            //TODO: check if file exists
            sampleList[noteNumber]=noteNumber+".mp3";
            // this is slow and deos not work...
            // if ( fileExists(process.env.PUBLIC_URL +"/sounds/instruments/" + instrument + "/" + noteNumber+".mp3") ) {
            //     sampleList[noteNumber]=noteNumber+".mp3";
            // } else {
            //     console.log("Sample not found", noteNumber, instrument);
            // }

        }
        const sampler = new Tone.Sampler( {
                urls: sampleList,
                baseUrl: process.env.PUBLIC_URL +"/sounds/instruments/"+instrument + "/",
                release: 1,
                onerror: (error) => { console.log("error on loading", error); dispatch(setIsLoading(false)); },
                onload: () => { console.log("Samples loaded"); sampler.connect(reverb); dispatch(setIsLoading(false));}
            }
        ).sync();
        return sampler;
    }



    const reverb = new Tone.Reverb( {decay:2.5, wet:0.1} ).toDestination();
    //sampler.connect(reverb);


    const playNote = (noteNumber, start=0, duration=1,  volume=0.6 ) => { // csound kind of order of parameters:
        const midiNote = bassInstruments.includes(instrument) ? noteNumber-24 : noteNumber; // 2 octaves lower for bass instrument
        console.log("playNote", instrument, noteNumber, midiNote, start, Tone.Transport.state);
        const freq = Tone.Frequency(midiNote, "midi").toFrequency();
        //console.log("masterVolume at playNote: ", masterVolume);
        if (sampler) {
            sampler.triggerAttackRelease(freq, duration, start, volume*masterVolume);
        } else {
            console.log("Sampler is null: ", sampler);
        }
    }

    const stopSound = () => {
        // does not work
        // disconnect would stop the sound but this is bad solution
        sampler.releaseAll();
        Tone.Transport.cancel();
        //Tone.Transport.stop("+0.01");
        Tone.Transport.stop();
    }

     const playNoteWithMidiSounds = (midiNote, start, duration) => {
        //midiSounds.current.playChordAt (midiSounds.current.contextTime()+start, 3, [midiNote], duration); // millegipärast ei tööta, kui korrata intervalli
    };

    // ----

    const setResponseInterval = (shortName, index=-1) => {
        const currentResponse = response; // was: .slice() - that seems to be correct way, but  did not work in randomInterval
        console.log("response now: ", response);
        const theIndex = index===-1 ? currentResponseIndex : index;
        if (typeof(currentResponse[theIndex])==="object") {
            currentResponse[theIndex].intervalShortName = shortName;
        } else {
            currentResponse[theIndex] = {intervalShortName: shortName}
        }
        console.log("Setting interval: ", shortName, currentResponseIndex, currentResponse)
        setResponse(currentResponse);
    }

    const setResponseDegrees = (degrees=[], index=0) => {
        const currentResponse = response.slice(); // NB! simple = response; creates just reference.
        if (typeof(currentResponse[index])==="object") {
            currentResponse[index].degrees = degrees;
        } else {
            currentResponse[index] = {degrees: degrees};
        }
        setResponse(currentResponse);
    }

    const getResponseIntervalShortName = (index=0) => {
        if (response[index]) {
            if (response[index].intervalShortName) {
                return response[index].intervalShortName;
            }
        } else {
            return "";
        }
    };

    const getCorrectIntervalShortName = (index=0) => {
        if (intervalData[index]) {
            if (intervalData[index].interval) {
                return intervalData[index].interval.shortName;
            }
        }
        return "";
    };

    const getResponseDegrees = (index=0) => {
        if (response[index]) {
            if (response[index].degrees) {
                return response[index].degrees;
            }
        }
        return [];
    };

    const getCorrectDegrees = (index=0) => {
        if (intervalData[index]) {
            if (intervalData[index].degrees) {
                return intervalData[index].degrees;
            }
        }
        return [];
    };


    const checkInterval= (intervalShortName, index=0) =>  {
        let correct = true;
        if (intervalData[index].interval) {
            if (intervalData[index].interval.shortName !== intervalShortName) {
                correct = false;
                console.log("Wrong interval, correct is: ", intervalData[index].interval.shortName)
            } else {
                console.log("Interval correct: ", intervalShortName);
            }
        } else correct = false;
        return correct;
    }

    const checkDegrees = (index=0) => {
        //const degrees= response[index].degrees;
        let degrees = [];
        if (degreesEnteredByUser[index]) {
            degrees = degreesEnteredByUser[index].split(" ");
        } else {
            console.log("Degrees not entered on index: ", index);
        }
        
        if (mode==="harmonic") {
            degrees.sort(); // take care that intervalData.degrees is sorted, too, in getIntervalFromScale
        }

        let correct = true;
        if (intervalData[index].degrees) {
             for (let i=0; i<intervalData[index].degrees.length; i++) {
                 if (parseInt(degrees[i]) !== intervalData[index].degrees[i]) {
                     console.log("Wrong degree, correct should be: ", degrees[i], intervalData[index].degrees[i]  );
                     correct = false;
                 } else {
                     console.log("Degree is correct!", degrees[i] );
                 }
             }
        } else correct = false;
        return correct;
    }

    const checkResponse = () => {

        if (answered) {
            alert(t("alreadyAnswered"));
            return;
        }

        if (!exerciseName.includes("random") ) { // demand degrees to be entered if in key
            let degreesNotEntered = false;
            for (let r of response) {
                if (!r) {
                    degreesNotEntered = true;
                } else if (!r.degrees) {
                    degreesNotEntered = true;
                } else if (r.degrees.length = 0) {
                    degreesNotEntered = true;
                }
            }
            if (degreesNotEntered) {
                alert(capitalizeFirst( t("enterDegrees")));
                return;
            }
        }

        setAnswered(true);
        let correct = true;
        const correctButtons = []; // maybe use it only when intervalCount==1, and just a string, not array...
        const greenButtons = [];
        const redButtons = [];

        if (exerciseHasBegun) {

            for (let i=0; i<intervalCount; i++) {
                const shortName = getResponseIntervalShortName(i); // response[i].intervalShortName;
                console.log("checkResponse ", i, shortName);
                correctButtons.push(getCorrectIntervalShortName(i));

                if (shortName) {
                    const intervalCorrect = checkInterval(shortName,i);
                    correct = correct && intervalCorrect;
                    if (intervalCorrect) {
                        correct = correct && true;
                        greenButtons.push(shortName);
                    } else {
                        correct = false;
                        redButtons.push(shortName);
                    }
                } else {
                    correct = false;
                }

                setGreenIntervalButtons(greenButtons);
                setRedIntervalButtons(redButtons);
                setCorrectIntervalButtons(correctButtons);

                if (degreesEnteredByUser[i]) {
                    const degreesCorrect = checkDegrees(i);
                    correct = correct && degreesCorrect;
                    if (degreesCorrect) {
                        correct = correct && true;
                    } else {
                        correct = false;
                    }
                }
            }


            if ( correct ) {
                //dispatch(setPositiveMessage(feedBack, 5000));
                dispatch(incrementCorrectAnswers());
                const waitTime = intervalCount===1 ?  1000 : 2500; // give some tim before the next one
                //Tone.Transport.scheduleOnce( () => renew(), "+3.0"); // does not work - still first note is played later... Csound?
                setTimeout( ()=> renew(), waitTime); // small delay to let user to see the answer -  maybe add this to cofig options
            } else {
                dispatch(incrementIncorrectAnswers());
            }
        }
    };

    // UI ---------------------------------------------

    const closeMenu = () => {
        dispatch(setSettingsMenuOpen(false));
    }

    const createCustomMenu = () => {

        const intervalCountEntry = <MenuItem key={"intervalyCount"}>
            <label id="intervalCountLabel" className={"marginRightSmall"}>{capitalizeFirst(t("intervalCount"))}:</label>
            <Select
                labelId={"intervalCountLabel"}
                defaultValue={intervalCount}
                onChange={ (e)=>{
                    const count = e.target.value;
                    setIntervalCount(parseInt(count));
                    localStorage.setItem("intervalCount", count);
                    closeMenu();
                }
            }
            >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
            </Select>
        </MenuItem>;

        const playMode =  localStorage.getItem("intervalPlayMode") ||  "harmonic";

        const playModeEntry = <MenuItem key={"playMode"}>
            <label id="modeLabel" className={"marginRightSmall"}>{capitalizeFirst(t("playMode"))}:</label>
            <Select
                // disabled={exerciseName === "tonicTriad"} // if tonic triad intervals, no choice, always melodic and harmonic then
                labelId={"modeLabel"}
                defaultValue={playMode}
                onChange={ (e)=>{
                    const newMode = e.target.value;
                    setMode(newMode);
                    localStorage.setItem("intervalPlayMode", newMode);
                    closeMenu(); }
                }
            >

                <MenuItem value={"melodic"}>{capitalizeFirst(t("melodic"))}</MenuItem>
                <MenuItem value={"harmonic"}>{capitalizeFirst(t("harmonic"))}</MenuItem>
                <MenuItem value={"melodicHarmonic"}>{capitalizeFirst(t("melodicAndHarmonic"))}</MenuItem>
            </Select>
        </MenuItem>;

        const showIntervalSelectionEntry = <MenuItem key={"chordSelectionEntry"}>
            <FormControlLabel
                onChange={ (e) => {setShowIntervalSelection(e.target.checked); closeMenu();}  }
                control={<Checkbox color="default" />}
                label={capitalizeFirst(t("intervalSelection"))}
            />
        </MenuItem>;

        const infoEntry = <MenuItem disabled>Abiinfo - tegemata veel</MenuItem>

        const menuEntries = [ intervalCountEntry, playModeEntry, showIntervalSelectionEntry ];
        dispatch(setCustomMenu(menuEntries));
    }
   
    const createControlButtons = () => {
        const startExerciseButton = <Button variant="contained" ref={startButtonRef} key={"startExercise"} color={"primary"} onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>;
        const changeKeyButton = exerciseName.includes("random")  ? null :
            <Button variant="contained" key={"changeKey"}  onClick={changeKey} className={"fullWidth marginTopSmall"}>{t("changeKey")}</Button>;
        const playNextIntervalButton = <Button variant="contained" key={"playNext"} color={"primary"} onClick={() => renew()} className={"fullWidth marginTopSmall"}>{t("playNext")}</Button>;
        const repeatIntervalButton = <Button variant="contained" key={"repeat"} color={"secondary"} onClick={() => play(intervalData)} className={"fullWidth marginTopSmall"}>{t("repeat")}</Button>;
        const playTonicButton = exerciseName.includes("random")  ? null :
            <Button variant="contained" key={"playTonic"} className={"fullWidth marginTopSmall"} onClick = {()=> playTonicTriad(selectedTonicNote.midiNote, isMajor, 1)}>{capitalizeFirst( t("tonic") )}</Button>
        if (exerciseHasBegun) {
            return (
                <>
                    <Grid item container spacing={1} direction={"row"} className={"exerciseRow"}>
                        <Grid item xs={6}>{playNextIntervalButton}</Grid>
                        <Grid item xs={6}>{repeatIntervalButton}</Grid>
                    </Grid>
                    <Grid item container spacing={1} direction={"row"} className={"exerciseRow"}>
                        <Grid item xs={6}>{playTonicButton}</Grid>
                        <Grid item xs={6}>{changeKeyButton}</Grid>
                    </Grid>
                </>
            )
        } else {
            return (<Grid item> {startExerciseButton}</Grid>);
        }

    };

    const labelAnimationTime = 150;

    const createIntervalLabelRow = () => {

        if (intervalCount===1) return null;

        const elements = [];
        for (let i=0; i<intervalCount; i++ ) {
            const responseShortName = getResponseIntervalShortName(i);
            const correctShortName = getCorrectIntervalShortName(i);
            const isCorrect = responseShortName===correctShortName;
            //const color =  answered ?  ( isCorrect ? "primary" : "secondary") :  (currentResponseIndex===i ? "primary" : "");
            //TODO: Button pole ilmselt parim siiski sildi jaoks, proovi pigem TextField as button? label?
            elements.push( // was Grid.Column before
                <React.Fragment key={"intervalLabel"+i}>
                    <Button
                        key={i}
                        className={"marginRight"}
                        onClick={() => setCurrentResponseIndex(i)}
                        // color = {color}
                        size={"small"}
                        variant={"outlined"}
                    >
                        { responseShortName ? responseShortName : "?"}
                </Button>

                    { answered && !isCorrect && (
                        <>
                            <label className={"marginRight"}>{capitalizeFirst(t("correct"))+": "}</label>
                            <TextField
                                style={{width:70, marginRight:5 }}
                                value={correctShortName}

                            />
                        </> )}

                </React.Fragment>

            );
        };

        elements.push(<Button variant="contained" key={"checkButton"} size={"small"} onClick={checkResponse} >{capitalizeFirst(t("check"))}</Button>);

        return exerciseHasBegun && (

            <Grid item container spacing={1} direction={"row"} className={"exerciseRow marginTopSmall"}>
                <span className={"marginLeft marginRight"} >{capitalizeFirst(t("intervals"))}: </span>
                {elements}
            </Grid>
        );
    };

    const insertSpaces = (input) => { // iserts spaces between digits like 12 becomes 1 2
        const index = input.length - 1;
        // if two last symbols are digits, insert a space in between of them
        if (index >= 1) {
            if (isDigit(input.charAt(index)) && isDigit(input.charAt(index - 1))) {
                input = input.substr(0, index) + " " + input.substr(index);
                //console.log("Inserted space: ", input, index, input.substr(0, index));
            }
        }
        return input;
    }

    // create selction menu of intervals
    const handleIntervalSelection = (e,data) => {
        const shortName = e.target.name;
        const checked = e.target.checked;

        if (checked) {
            console.log("Add to possibleSharnames: ", shortName);
            const shortNames = activeIntervals.slice();
            if (!shortNames.includes(shortName)) {
                shortNames.push(shortName);
                setActiveIntervals(shortNames);
                console.log(shortNames);
            }
        } else {
            console.log("Remove from possibleShortnames: ", shortName);
            const shortNames =  activeIntervals.filter( (elem)=>elem!==shortName ) ;
            setActiveIntervals(shortNames);
            console.log(shortNames);
        }
    }

    const deselectAll = () => {
        setActiveIntervals([]);
    }

    const selectAll = () => {
        setActiveIntervals(possibleIntervalShortNames);
    }


    const createIntervalSelection = () => {
        return exerciseHasBegun &&  showIntervalSelection && (
            <>
                <Grid item container spacing={1} direction={"row"}>
                    <Grid item>
                        <Button  size={"small"} onClick={selectAll} >
                            {capitalizeFirst(t("selectAll"))}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button  size={"small"} onClick={deselectAll} >
                            {capitalizeFirst(t("deselectAll"))}
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container spacing={1} direction={"row"}>
                    {possibleIntervalShortNames.map( shortName =>  (
                        <Grid item key={shortName}>
                            <FormControlLabel
                                onChange={ handleIntervalSelection }
                                checked={ activeIntervals.includes(shortName) }
                                control={<Checkbox color="default" />}
                                label={shortName}
                                name={shortName}
                            />
                        </Grid>
                    ))}
                </Grid>
            </>
        );
    }


    const createDegreeInputRow = () => {
        const inputs = [];
        for (let i=0; i<intervalCount; i++ ) {
            const responseDegreeString = degreesEnteredByUser[i]; //getResponseDegrees(i).join(" "); -  somehow the  array/obect in responsedegrees get zeroed too soon
            const correctDegreeString = getCorrectDegrees(i).join(" ");
            const isCorrect = responseDegreeString===correctDegreeString;
            const labelColor = isCorrect  ? "green" : "red";
            //console.log("degreeInputs: i, responseDegreeString, correctDegreeStrinv, labelColor", i, responseDegreeString, correctDegreeString, labelColor);
            inputs.push(
                <React.Fragment key={"degreeElement"+i}>
                    <TextField
                        key={"degreeInput"+i}
                        style={{width:80, marginRight:5}}
                        onChange={e => {
                            const input = insertSpaces(e.target.value);
                            const currentUserDegrees = degreesEnteredByUser.slice();
                            currentUserDegrees[i] = input;
                            setDegreesEnteredByUser(currentUserDegrees);
                            setResponseDegrees(input.split(" "), i);
                        }}
                        value={degreesEnteredByUser[i] ? degreesEnteredByUser[i] : ""} // can't we use getResponseDegrees here?
                        placeholder={'e.g.: 1 3'}
                        error={answered && !isCorrect}
                        aria-invalid={answered && !isCorrect}
                    />
                    { answered && !isCorrect && (
                        <>
                            <label className={"marginRight"}>{capitalizeFirst(t("correct"))+": "}</label>
                            <TextField
                                style={{width:70, marginRight:5 }}
                                value={correctDegreeString}

                            />

                        </> )}
                </React.Fragment>
            );
        };

        return exerciseHasBegun && !exerciseName.includes("random") && (
            <Grid item container spacing={1} direction={"row"} className={"exerciseRow"}>
                <span  className={"marginLeft marginRight"}>{ capitalizeFirst( t("enterDegrees") )}: </span>
                {inputs}
            </Grid>
        );
    }

    const getButtonColor = (buttonInterval) => {
        let color = "";
        if (greenIntervalButtons.includes(buttonInterval)) {
            color = "green";
        } else if (redIntervalButtons.includes(buttonInterval)) {
            color = "red"; // TODO: get from the theme somehow
        } else if (correctIntervalButtons.includes(buttonInterval)) { // mark correct but not pressed buttons(s)
            color = "teal";
        }

        return color;
    };

    const createIntervalButton = (interval, displayedName) => {
        return (
            <Grid item xs={4}>
                <Button variant="contained"
                        className={"fullWidth marginTopSmall" }
                        disabled={!activeIntervals.includes(interval)}
                        style={{backgroundColor: getButtonColor(interval)}}
                        onClick={() => {
                            setResponseInterval(interval);
                            if (intervalCount===1) {
                                checkResponse();
                            } else {
                                if (currentResponseIndex<intervalCount-1) { // activate next interval label
                                    setCurrentResponseIndex(currentResponseIndex+1);
                                } else {
                                    setCurrentResponseIndex(0); // back to beginning necessary for re-rendering and showing the label. Bad code.
                                }
                            }
                        }
                        }
                > {displayedName} </Button>
            </Grid>
        )
    };

    const createIntervalInputRow = () => { // for VI -  visually impaired
        const elements = [];
        for (let i=0; i<intervalCount; i++ ) {
            const responseShortName = getResponseIntervalShortName(i);
            const correctShortName = getCorrectIntervalShortName(i);
            const isCorrect = responseShortName === correctShortName;
            //const color =  answered ?  (isCorrect ? "green" : "red") : "grey";
            elements.push(
                <React.Fragment key={"intervalField"+i}>
                    <TextField
                        key={"intervalInput"+i}
                        style={{width:70, marginRight:5}}
                        onChange={e => {
                            setResponseInterval(e.target.value, i);
                        }}
                        onKeyPress={ e=> { if (e.key === 'Enter') checkResponse()  }}
                        /*value={getResponseIntervalShortName(i)}*/ // can't we use getResponseDegrees here?
                        placeholder={'e.g.: v3'}
                        error={answered && !isCorrect}
                        aria-invalid={answered && !isCorrect}
                    />
                    { answered && !isCorrect && (
                        <>
                            <label className={"marginRight"}>{capitalizeFirst(t("correct"))+": "}</label>
                            <TextField
                                style={{width:70, marginRight:5 }}
                                value={correctShortName}

                            />
                        </> )}
                </React.Fragment>
            );
        }
        elements.push(<Button variant="contained" key={"checkButton"} size={"small"} onClick={checkResponse} >{capitalizeFirst(t("check"))}</Button>);

        return exerciseHasBegun && (
            <Grid item container spacing={1}  direction={"row"} className={"exerciseRow"}>
                <span  className={"marginLeft marginRight"}>{ capitalizeFirst( t("enterIntervals") )}: </span>
                {elements}
            </Grid>
        );

    };

    const createIntervalButtons = () => {
        return exerciseHasBegun &&  (
            <>
                <Grid item container spacing={1} direction={"row"} className={"exerciseRow"}>
                    {/*TODO: support translation*/}
                    {createIntervalButton("v2", "v2")} {/*was: ${capitalizeFirst(t("minor"))} ${t("second")}*/}
                    {createIntervalButton("p4", "p4")}
                    {createIntervalButton("s2", "s2")}

                </Grid>
                <Grid item container spacing={1} direction={"row"} className={"exerciseRow"}>
                    {createIntervalButton("v3", "v3")}
                    {createIntervalButton("p5", "p5")}
                    {createIntervalButton("s3", "s3")}

                </Grid>
                <Grid item container spacing={1} direction={"row"} className={"exerciseRow"}>
                    {createIntervalButton("v6", "v6")}
                    {createIntervalButton(">5", "Trit. (>5/<4)")}
                    {createIntervalButton("s6", "s6")}
                </Grid>
                <Grid item container spacing={1} direction={"row"} className={"exerciseRow"} >
                    {createIntervalButton("v7", "v7")}
                    {createIntervalButton("p8", "p8")}
                    {createIntervalButton("s7", "s7")}
                </Grid>
            </>
        );
    }

    // temporary code, keep it here:
    const createMenuRow = () => {
        // This is only placeholder, not used for now:
        return (
            <>
                <Button variant="outlined" color="primary" onClick={()=>setDialogOpen(!dialogOpen)}>
                    Info
                </Button>
             <Dialog
                 open={dialogOpen}
                 onClose={null}
                 aria-labelledby="alert-dialog-title"
                 aria-describedby="alert-dialog-description">
                 <DialogTitle id="alert-dialog-title">Info</DialogTitle>
                 <DialogContent
                     id="alert-dialog-description"
                 >
                     <h3>Klahvikombinatsioonid</h3>
                     <p>Intervallid: v+2, s+2, jne (täht enne, siis number, hoida samaaegselt). </p>
                     <p>NB! Tritoon (vähendatud kvint) - d+5 (diminished)</p>
                     <p>Mängi järgmine: shift+paremale</p>
                     <p>Korda: shift+alla</p>
                     <p>Alusta harjutust/Muuda helistikku: shift+üles</p>
                     <p>Tagasi peamenüüsse - veel pole</p>
                 </DialogContent>
                 <DialogActions>
                     <Button onClick={{/*handleClose*/}} color="primary">
                         Disagree
                     </Button>
                     <Button onClick={{/*handleClose*/}} color="primary" autoFocus>
                         Agree
                     </Button>
                 </DialogActions>

             </Dialog>

            </>
        );
    }


    return (
        <div>
            <h2 size='large'>{`${t("setInterval")} ${t(exerciseName)}`}</h2>
            <Grid container spacing={1} direction={"column"}>
                <ScoreRow />
                {createDegreeInputRow()}
                {createIntervalSelection() }
                {VISupportMode ? null : createIntervalLabelRow()}
                {VISupportMode ? createIntervalInputRow() : createIntervalButtons()}
                { exerciseHasBegun && <VolumeRow /> }
                {createControlButtons()}
                <Grid item>
                        <GoBackToMainMenuBtn/>
                </Grid>
            </Grid>
{/*
            <MIDISounds ref={midiSounds} appElementName="root" instruments={[3]} />
*/}
        </div>
    );
};

export default AskInterval;