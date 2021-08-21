import React, {useState, useRef, useEffect} from 'react';

import {
    Button,
    CircularProgress,
    TextField,
    Checkbox,
    FormControlLabel,
    Grid,
    FormControl, FormLabel, RadioGroup, Radio, Snackbar
} from "@material-ui/core"
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {getRandomElementFromArray, getRandomBoolean, capitalizeFirst, simplify} from "../util/util";
import {chordDefinitions, makeVexTabChord, makeChord} from "../util/intervals";
import {getNoteByName, getNoteByVtNote} from "../util/notes";
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import ScoreRow from "./ScoreRow";
import Notation from "./notation/Notation";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import {useParams} from "react-router-dom";
import { useHotkeys } from 'react-hotkeys-hook';
import CsoundObj from "@kunstmusik/csound";
import {dictationOrchestra as orc} from "../csound/orchestras";
import VolumeRow from "./VolumeRow";



const AskChord = () => {
    const { name } = useParams();

    useHotkeys('shift+ctrl+1', () => console.log("CTRL+1")); // how is it on Mac?
    useHotkeys('shift+ctrl+2', () => console.log("CTRL+2"));
    useHotkeys('shift+ctrl+3', () => console.log("CTRL+3"));
    useHotkeys('shift+ctrl+space', () => { console.log("SPACE"); renew(possibleChords);  });

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const VISupportMode = useSelector(state => state.exerciseReducer.VISupportMode);
    const masterVolume = useSelector(state => state.exerciseReducer.volume);
    const instrument =  useSelector(state => state.exerciseReducer.instrument);

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [possibleChords, setPossibleChords] = useState([]); // possibleChors -  whole set to choose from
    const [chordEntered, setChordEntered] = useState (""); // selected (checked on UI) by user
    const [selectedChord, setSelectedChord] = useState([]);
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [baseNote, setBaseNote] = useState(null); // asenda see chordNotes[0]
    const [vexTabChord, setVexTabChord] = useState("");
    const [chordNotes, setChordNotes] = useState([]);
    //const [notationVisible, setNotationVisible] = useState(false);
    const [useNotation, setUseNotation] = useState(false);

    const [notesEnteredByUser, setNotesEnteredByUser] = useState(""); // test

    const [volume, setVolume] = useState(0.6);
    const [usePopJazzNaming, setUsePopJazzNaming] = useState(false);

    //const userEnteredNotes = useSelector(state => state.exerciseReducer.userEnteredNotes);
    const startButtonRef = useRef(null);

    useEffect( () => {
        document.title = `${ capitalizeFirst( t(name) )}`;
        startButtonRef.current.focus();  // probably does not work since dimmer (loader is in between)
        // see using callback ref:
    }, []); // set title for screen reader

    useEffect(  () => {
           if (csound) {
               loadResources(csound,  60, 84, instrument); // NB! should use async () amd await loadResources in normal case
           }
    }, [instrument]);

    useEffect(  () => {
        if (csound) {
            csound.setControlChannel("volume", masterVolume);
        }
    }, [masterVolume]);

    // const shortcutManager = new ShortcutManager(keymap);

    // siin pole kõik noodid, sest duubel-dieesid/bemollid pole veel kirjeldatud (va heses testiks)
    // kui ehitada alla, siis peaks olema ilmselt teine valik
    const possibleBaseVtNotes = ["C/4", "D/4",  "E@/4", "E/4", "F/4",
        "G/4", "A/4", "B@/4", "C/5" ];

    const shortName = usePopJazzNaming ? "shortNamePJ" : "shortName";
    const longName = usePopJazzNaming ? "longNamePJ" : "longName";


    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        console.log("startExercise");
        setExerciseHasBegun(true);

        // what is right place for setting the volume?
        //midiSounds.current.setMasterVolume(0.3); // not too loud TODO: add control slider

        let possibleChords = [];

        if (name.includes(".")) { // allow giving the chord names (via shortName) as name via URL like /M.m.M6.m6
            console.log("Extract possible chords from name: ");
            const shortNames = name.toString().split(".");
            console.log(shortNames);
            for (let shortName of shortNames) {
                const chord = chordDefinitions.find( chord => chord.shortName === shortName );
                console.log("Chord:", chord);
                if (chord) {
                    possibleChords.push(chord);
                }
            }
            if (possibleChords.length==0) {
                console.log("No valid chord found!");
                return;
            } else {
                console.log("Number of chords being used: ", possibleChords.length);
            }
        } else {

            switch(name) {
                case "MmTriad":
                    possibleChords.push(
                        chordDefinitions.find( chord => chord.shortName === "M" ),
                        chordDefinitions.find( chord => chord.shortName === "m" )
                    );
                    break;
                case "MmdaTriad":
                    possibleChords.push(
                        chordDefinitions.find( chord => chord.shortName === "M" ),
                        chordDefinitions.find( chord => chord.shortName === "m" ),
                        chordDefinitions.find( chord => chord.shortName === "dim" ),
                        chordDefinitions.find( chord => chord.shortName === "aug" ),
                    );
                    break;
                case "MmInversions": // new -  without dim and aug
                    possibleChords.push(
                        chordDefinitions.find( chord => chord.shortName === "M" ),
                        chordDefinitions.find( chord => chord.shortName === "m" ),
                        chordDefinitions.find( chord => chord.shortName === "M6" ),
                        chordDefinitions.find( chord => chord.shortName === "m6" ),
                        chordDefinitions.find( chord => chord.shortName === "M64" ),
                        chordDefinitions.find( chord => chord.shortName === "m64" )
                    );
                    break;
                case "MmdaInversions":
                    possibleChords.push(
                        chordDefinitions.find( chord => chord.shortName === "M" ),
                        chordDefinitions.find( chord => chord.shortName === "m" ),
                        chordDefinitions.find( chord => chord.shortName === "M6" ),
                        chordDefinitions.find( chord => chord.shortName === "m6" ),
                        chordDefinitions.find( chord => chord.shortName === "M64" ),
                        chordDefinitions.find( chord => chord.shortName === "m64" ),
                        chordDefinitions.find( chord => chord.shortName === "dim" ),
                        chordDefinitions.find( chord => chord.shortName === "dim6" ),
                        chordDefinitions.find( chord => chord.shortName === "aug" ),
                    );
                    break;
                case "7inversions": // new -  dominant7 and others
                    possibleChords.push(
                        chordDefinitions.find( chord => chord.shortName === "V7" ),
                        chordDefinitions.find( chord => chord.shortName === "V65" ),
                        chordDefinitions.find( chord => chord.shortName === "V43" ),
                        chordDefinitions.find( chord => chord.shortName === "V2" )
                    );
                    break;
                case "septachords":
                    possibleChords.push(
                        chordDefinitions.find( chord => chord.shortName === "V7" ),
                        chordDefinitions.find( chord => chord.shortName === "m7" ),
                        chordDefinitions.find( chord => chord.shortName === "M7" ),
                        chordDefinitions.find( chord => chord.shortName === "hdim7" ),
                        chordDefinitions.find( chord => chord.shortName === "dim7" ),
                    );
                    break;
                case "allChords":
                    possibleChords = chordDefinitions;
                    break;
                default:
                    possibleChords = chordDefinitions;
            }
        }

        possibleChords.map(item => item.active=true);
        setPossibleChords(possibleChords);

        if (!csoundStarted) {
            //setIsLoading(true); // does not work
            startCsound().then(r => {console.log("Started Csound");
            csound.setControlChannel("volume", masterVolume);
            renew(possibleChords)});
        } else {
            renew(possibleChords);
        }

    };


    // renew generates answer and performs play/show
    const renew = (possibleChords) =>  {

        setAnswered(false);
        const activeChords = possibleChords.filter(c => c.active);

        if (activeChords.length===0) {
            alert(capitalizeFirst(t("selectSomeChords")));
            return;
        }

        // take care that the chord and basenote are not exactyl the same as last time
        let thisBaseNote = baseNote;
        let chord = selectedChord;
        let midiNote = 0;


        while (thisBaseNote===baseNote && chord===selectedChord) {
            thisBaseNote = getNoteByVtNote( getRandomElementFromArray(possibleBaseVtNotes) );
            if (thisBaseNote === undefined) {
                console.log("Failed finding basenote");
                return;
            }
            midiNote = thisBaseNote.midiNote;
            chord = getRandomElementFromArray(activeChords);
        }

        setSelectedChord(chord);
        setBaseNote(thisBaseNote);
        console.log("Selected chord: ", t(selectedChord.longName), thisBaseNote.midiNote );
        const answer = {shortName: chord.shortName}; // may be different in different exercises, might need switch/case
        setAnswer(answer);

        const chordNotes = makeChord( thisBaseNote, chord.shortName  );
        setChordNotes(chordNotes);
        const up = getRandomBoolean();
        if ( up ) {
            setVexTabChord(":4 (" + thisBaseNote.vtNote + ")$.top." + capitalizeFirst(t("up")) + "$");
        } else {
            setVexTabChord(":4 (" + chordNotes[chordNotes.length-1].vtNote + ")$.top." + capitalizeFirst(t("down")) + "$"); // upper note, last one in the array
        }
        //setUserEnteredNotes("");
        setChordEntered("");

        play(chord, midiNote);



    };

    const play = (selectedChord, baseMidiNote=60) => {
        const duration = 4; // TODO: make configurable
        const midiNotes = [];
        for (let midiInterval of selectedChord.midiIntervals) { // nootide kaupa basenote + interval
            midiNotes.push(baseMidiNote + midiInterval);
        }
        // Csound implementation:
        const compileString = `giNotes[] fillarray ${midiNotes.join(",")}`;
        console.log("Compile: ", compileString);
        csound.compileOrc(compileString);
        //csound.setControlChannel("beatLength", beatLength);
        csound.readScore(`i "PlayChord" 0 0 `);  // if called startExercise->renew->playChord, the giNotes are not there yet, later OK

        //console.log("Midinotes played: ", midiNotes, baseMidiNote, selectedChord.shortName);
        //midiSounds.current.playChordNow(3, midiNotes, duration);
    };

    const checkNotation = () => {
        // show correct notation next to entered notation

        let correct = false;
        console.log("User eneter notes: ", vexTabChord, chordNotes)

        if (vexTabChord === makeVexTabChord(chordNotes) ) {
            console.log("Notes are correct");
            correct = true;
        } else {
            console.log("Notes are wrong");
            correct = false;
        }

        setVexTabChord( vexTabChord  +  " =|| " + makeVexTabChord(chordNotes) ); // double bar in between
        return correct;
    }

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
        const correctChord = t(selectedChord[longName]);


        if (useNotation) {
            if (checkNotation()) {
                // feedBack += capitalizeFirst(t("notation")) + " "  + t("correct") + ". ";  //kas siin annaks ka ${` `} sorti stringi kasutada ja vätlida + " "?
                feedBack += `${capitalizeFirst(t("notation"))} ${t("correct")}. `;
                correct = true;
            } else {
                feedBack += capitalizeFirst(t("notation")) + " "  + t("wrong") + ". ";
                correct = false;
            }
        }

        if (JSON.stringify(response) === JSON.stringify(answer)) {
            feedBack += capitalizeFirst(t("chord")) + " "  + t("correct") + ": " + correctChord;
            correct = correct && true;
        } else {
            feedBack += capitalizeFirst(t("chord")) + " "  + t("wrong") + ". " + capitalizeFirst(t("correct")) + " " + t("is") + " " + correctChord;
            correct = false;
        }

        if ( correct ) {
            if (!VISupportMode) {
                dispatch(setPositiveMessage(feedBack, 5000));
            }
            dispatch(incrementCorrectAnswers());
            const waitTime =  1000;
            setTimeout( ()=> renew(possibleChords), waitTime); // small delay to let user to see the answer -  maybe add this to config options
        } else {
            if (!VISupportMode) {
                dispatch(setNegativeMessage(feedBack, 5000));
            }
            dispatch(incrementIncorrectAnswers());
        }

    };



    // SHORTCUTS =============================================

    const handleShortcuts = (action, event) => {
        switch (action) {
            case 'CHORD1':
                console.log('CHORD1 call according button');
                checkResponse({shortName: possibleChords[0].shortName})
                break;
            case 'CHORD2':
                console.log('CHORD2')
                checkResponse({shortName: possibleChords[1].shortName})
                break;
            case 'NEW':
                console.log('play next');
                renew(possibleChords);
                break;
        }
    }

    // TEMPORARY -  need rewrite (clef, proper parsing etc)
    const noteStringToVexTabChord =  (noteString) => { // input as c1 es1 ci2 -  will be converted to vextab chord for now
        const noteNames = noteString.trim().split(" ");
        const chordNotes = [];
        for (let name of noteNames) {
            const lastChar = name.charAt(name.length-1);
            // better use regexp in future
            if (lastChar === "\'") { // sign for 2nd octava for now add 2 to notename
                name = name.slice(0, -1) + "2";
            } else if  ( !(lastChar >= '0' && lastChar <= '9' ) ) { // if octave number is not set, add 1 for 1st octave ( octave 4 in English system)
                name += '1';
            }
            const note = getNoteByName(name);
            if (note !== undefined) {
                chordNotes.push(note);
            } else {
                console.log("Could not find note according to: ", name)
            }
        }
        if (chordNotes.length>0) {
            return makeVexTabChord(chordNotes);
        } else {
            return "";
        }
    };

    const renderNotes = () => {
        const vexTabString = noteStringToVexTabChord(notesEnteredByUser);
        //dispatch(setUserEnteredNotes(vexTabString));
        setVexTabChord(vexTabString);
    };

    // Csound functions =============================================
    // TODO: separate component for Csound business
    const [csoundStarted, setCsoundStarted] = useState(false);
    const [csound, setCsound] = useState(null);

    useEffect(() => {
        console.log("Csound effect 1");
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

        } else {
            csound.reset();
        }
    }, [csound]);

    async function loadResources(csound,  startinNote=60, endingNote=84, instrument="oboe") {
        if (!csound) {
            return false;
        }
        console.log("LOAD RESOURCES")
        for (let i = startinNote; i <= endingNote; i++) {
            const fileUrl = "sounds/instruments/" + instrument + "/2sec/" + i + ".ogg"; // longer notes for chords
            const serverUrl = `${process.env.PUBLIC_URL}/${fileUrl}`;
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
        console.log('start csound');
        if (csound) {
            await loadResources(csound, 60, 84, instrument);

            csound.setOption("-m0"); // does not affect the output... also --logfile=null not
            csound.setOption("-d");
            csound.compileOrc(orc);
            csound.start();
            csound.audioContext.resume();
            setCsoundStarted(true);
        } else {
            console.log("StartCsound: csound is null.");
        }
    };



    // UI ======================================================


    const createOptionsBlock = () => {
        return exerciseHasBegun && (
          <Grid item container spacing={1} direction={"row"} >
              <Grid item>
                  <FormControl component="fieldset">
                      <FormLabel component="legend">{capitalizeFirst(t("naming"))}</FormLabel>
                      <RadioGroup row aria-label="classicOrPopJazzNaming" name="usePopJazzNaming" value={usePopJazzNaming ? "popJazz" : "classical"}
                                  onChange={ (e) => {
                                      console.log("naming value: ", e.target.value);
                                      setUsePopJazzNaming( e.target.value==="popJazz");
                                  }}
                      >
                          <FormControlLabel value="classical" control={<Radio />} label={t("classical")} />
                          <FormControlLabel value="popJazz" control={<Radio />} label={t("popJazz")} />
                      </RadioGroup>
                  </FormControl>

              </Grid>
          </Grid>
        );
    };

    const createControlButtons = () => {
        if (exerciseHasBegun) {
            return (
                <Grid item container spacing={1} direction={"row"}>
                    <Grid item xs={6}>
                         <Button variant="contained"  color={"primary"} onClick={() => renew(possibleChords)} className={"fullWidth marginTopSmall"} >{t("playNext")}</Button>
                    </Grid>
                    <Grid item xs={6}>
                         <Button variant="contained"  onClick={() => play(selectedChord, baseNote.midiNote)} className={"fullWidth marginTopSmall"}  >{t("repeat")}</Button>
                    </Grid>
                </Grid>
            );
        } else {
            return(
                <Grid item container spacing={1} direction={"row"}  >
                     <Button variant="contained"  color={"primary"}
                             ref={startButtonRef}
                             disabled={(csound === null)}
                            onClick={startExercise}
                            className={"fullWidth marginTopSmall"}>
                        {t("startExercise")}
                         {(csound === null) && <CircularProgress aria-busy={(csound===null)} />}
                    </Button>
                </Grid>
            );
        }
    };
    
    const createResponseTextInput = () => {
        const isCorrect = chordEntered===selectedChord.shortName;
        return exerciseHasBegun && (
            <Grid item className={"exerciseRow"}>
                <span  className={"marginLeft marginRight"}>{ capitalizeFirst( t("enterChord") )}: </span>
                    <TextField
                        style={{width:70, marginRight:5}}
                        onChange={e => {
                            setChordEntered(simplify(e.target.value));
                        }}
                        value={chordEntered}
                        error={answered && !isCorrect}
                        aria-invalid={answered && !isCorrect}
                        onKeyPress={ e=> { if (e.key === 'Enter') checkResponse({shortName: chordEntered})  }}
                    />
                { answered && !isCorrect && (
                    <>
                        <label className={"marginRight"}>{capitalizeFirst(t("correct"))+": "}</label>
                        <TextField
                            style={{marginRight:5 }}
                            value={ `${t(selectedChord[shortName])}  ${t(selectedChord[longName])} `  }

                        />

                    </> )}
                 <Button variant="contained"  key={"checkButton"}  onClick={() => checkResponse({shortName: chordEntered})} >{capitalizeFirst(t("check"))}</Button>
            </Grid>
        );
    }


    const createResponseButtons = () => {
        const activeChords = possibleChords.filter(item => item.active);
        //.log(activeChords);
        const columns = []
        for (let i = 0, n = activeChords.length; i < n; i++) {
            const column = createResponseButtonColumn(activeChords[i]);
            columns.push(column);
        }
        return (<Grid item container spacing={1} direction={"row"}>
            {columns}
        </Grid>);
    };


    const createResponseButtonColumn = (chord) => {
        return (chord) ?
            (
            <Grid item xs={3} key = {"XC"+chord.shortName}>
                 <Button variant="contained"  className={"fullWidth marginTopSmall" /*<- kuvab ok. oli: "exerciseBtn"*/}
                        key = {chord.shortName}
                        onClick={() => checkResponse({shortName: chord.shortName})}>
                     { t(chord[shortName]) }
                 </Button>
            </Grid>
        ) : (<Grid item />)
    };


    const createNotationBlock = () => {
        if (useNotation) {
            return (
            <div>
                <div className={"marginTop"}>Sisesta noodid (nt. a c' es') ning klõpsa seejärel vasta akordi nupule</div>
                <TextField
                    onChange={e => {setNotesEnteredByUser(e.target.value)}}
                    onKeyPress={ e=> { if (e.key === 'Enter') renderNotes()  }}
                    placeholder={'nt: a c\' es\''}
                    value={notesEnteredByUser}
                />
                 <Button variant="contained"  onClick={renderNotes}>{ capitalizeFirst( t("render") )}</Button>
                <Notation  className={"marginTopSmall"} notes={vexTabChord} width={200} visible={true} /*time={"4/4"} clef={"bass"} keySignature={"A"}*//>
            </div>
            );
        } else {
            return null;
        }
    }


    const handleChordSelection = (e,data) => {

        const shortName = e.target.name;
        const checked = e.target.checked;

        const chords = possibleChords.slice();
        chords.find(c => c.shortName==shortName).active = checked;
        setPossibleChords(chords);
     }

     const deselectAll = () => {
        const currentChords = possibleChords.slice();
        currentChords.map(item => { item.active = false;  } );
        setPossibleChords(currentChords);
    }

    const selectAll = () => {
        const currentChords = possibleChords.slice();
        currentChords.map(item => item.active = true );
        setPossibleChords(currentChords);
    }


    const createChordSelection = () => {
        return exerciseHasBegun && (
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
                    {possibleChords.map( item =>  (
                        <Grid item key={item.shortName}>
                            <FormControlLabel
                                onChange={ handleChordSelection }
                                checked={item.active}
                                control={<Checkbox color="default" />}
                                label={item[shortName]}
                                name={item[shortName]}
                            />
                        </Grid>
                    ))}
                </Grid>
            </>
        );
    }



    return (
        <div>
            {/*<Shortcuts
                name='AskChord'
                handler={handleShortcuts}
            />*/}
            <h2 size='large'>{`${ capitalizeFirst( t(name) )} `}</h2>

            <Grid container spacing={1} direction={"column"}>

                {/*<Checkbox toggle
                          label={"Noteeri"}
                          defaultChecked={false}
                          className={"marginTop"}
                          onChange={ (e, {checked}) => setUseNotation(checked) }
                />*/}

                <ScoreRow/>
                {createOptionsBlock()}
                {createNotationBlock()}
                {createChordSelection()}
                {VISupportMode ? createResponseTextInput() : createResponseButtons()}
                {createControlButtons()}
                { exerciseHasBegun && <VolumeRow /> }
                <Grid item>
                        <GoBackToMainMenuBtn/>
                </Grid>
            </Grid>
        </div>

    );
};

export default AskChord;