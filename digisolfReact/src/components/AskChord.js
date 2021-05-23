import React, {useState, useRef, useEffect} from 'react';
import {Button, Checkbox, Dropdown, Grid, Header, Input} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {getRandomElementFromArray, getRandomBoolean, capitalizeFirst} from "../util/util";
import {chordDefinitions, makeVexTabChord, makeChord} from "../util/intervals";
import {getNoteByName, getNoteByVtNote} from "../util/notes";
import MIDISounds from 'midi-sounds-react';
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import ScoreRow from "./ScoreRow";
import Notation from "./notation/Notation";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import {useParams} from "react-router-dom";
import { useHotkeys } from 'react-hotkeys-hook';
import CsoundObj from "@kunstmusik/csound";
import {dictationOrchestra as orc} from "../csound/orchestras";
import {Slider} from "react-semantic-ui-range";


// tüüp 1: antakse ette noot ja suund, mängitakse akord
// kasutaja peab ehitama akordi (või vastama, mis see oli)
// lihtsaim variant: mängib akordi, vasta, kas maz või min
// tüüp 2: antakse akordijärgnevus, tuvasta, mis funtsioonid (T, D, S, M)
const AskChord = () => {
    const { name } = useParams();

    useHotkeys('shift+ctrl+1', () => console.log("CTRL+1")); // how is it on Mac?
    useHotkeys('shift+ctrl+2', () => console.log("CTRL+2"));
    useHotkeys('shift+ctrl+3', () => console.log("CTRL+3"));
    useHotkeys('shift+ctrl+space', () => { console.log("SPACE"); renew(possibleChords);  });

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // const name = useSelector(state => state.exerciseReducer.name);
    const midiSounds = useRef(null);

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [possibleChords, setPossibleChords] = useState([]);
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

    //const userEnteredNotes = useSelector(state => state.exerciseReducer.userEnteredNotes);

    // const shortcutManager = new ShortcutManager(keymap);

    // siin pole kõik noodid, sest duubel-dieesid/bemollid pole veel kirjeldatud (va heses testiks)
    // kui ehitada alla, siis peaks olema ilmselt teine valik
    const possibleBaseVtNotes = ["C/4", "D/4",  "E@/4", "E/4", "F/4",
        "G/4", "A/4", "B@/4", "C/5" ];


    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        console.log("startExercise");
        setExerciseHasBegun(true);
        // stat Csound
        if (!csoundStarted) {
            startCsound();
        }

        // what is right place for setting the volume?
        //midiSounds.current.setMasterVolume(0.3); // not too loud TODO: add control slider

        let possibleChords = [];

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
            case "MmdaInversions":
                possibleChords.push(
                    chordDefinitions.find( chord => chord.shortName === "M" ),
                    chordDefinitions.find( chord => chord.shortName === "m" ),
                    chordDefinitions.find( chord => chord.shortName === "M6" ),
                    chordDefinitions.find( chord => chord.shortName === "m6" ),
                    chordDefinitions.find( chord => chord.shortName === "M64" ),
                    chordDefinitions.find( chord => chord.shortName === "m64" ),
                    chordDefinitions.find( chord => chord.shortName === "dim" ),
                    chordDefinitions.find( chord => chord.shortName === "aug" ),
                );
                break;
            case "septachords":
                possibleChords.push(
                    chordDefinitions.find( chord => chord.shortName === "7" ),
                    chordDefinitions.find( chord => chord.shortName === "m7" ),
                    chordDefinitions.find( chord => chord.shortName === "M7" ),
                    chordDefinitions.find( chord => chord.shortName === "hdim7" ),
                    //chordDefinitions.find( chord => chord.shortName === "dim7" ),
                );
                break;
            default:
                console.log("no exercise found");
                return;
        }

        setPossibleChords(possibleChords);

        renew(possibleChords);

    };

    // renew generates answer and performs play/show
    const renew = (possibleChords) =>  {

        setAnswered(false);

        const baseNote = getNoteByVtNote( getRandomElementFromArray(possibleBaseVtNotes) );
        if (baseNote === undefined) {
            console.log("Failed finding basenote");
            return;
        } else {
            setBaseNote(baseNote);
        }
        const midiNote = baseNote.midiNote; // getRandomInt(53, 72); // TODO: make the range configurable
        const selectedChord = getRandomElementFromArray(possibleChords);
        setSelectedChord(selectedChord);
        console.log("Selected chord: ", t(selectedChord.longName), baseNote.midiNote );
        const answer = {shortName: selectedChord.shortName}; // may be different in different exercised, might need switch/case
        setAnswer(answer);

        const chordNotes = makeChord( baseNote, selectedChord.shortName  );
        setChordNotes(chordNotes);
        const up = getRandomBoolean();
        if ( up ) {
            setVexTabChord(":4 (" + baseNote.vtNote + ")$.top." + capitalizeFirst(t("up")) + "$");
        } else {
            setVexTabChord(":4 (" + chordNotes[chordNotes.length-1].vtNote + ")$.top." + capitalizeFirst(t("down")) + "$"); // upper note, last one in the array
        }
        //setUserEnteredNotes("");

        play(selectedChord, midiNote);



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
        csound.readScore(`i "PlayChord" 0 0 `);

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
        const correctChord = t(selectedChord.longName);


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
            feedBack += capitalizeFirst(t("chord")) + " "  + t("wrong") + ". " + capitalizeFirst(t("correct")) + t("is") + " " + correctChord;
            correct = false;
        }

        if ( correct ) {
            dispatch(setPositiveMessage(feedBack, 5000));
            dispatch(incrementCorrectAnswers());
        } else {
            dispatch(setNegativeMessage(feedBack, 5000));
            dispatch(incrementIncorrectAnswers());
        }

        // if not notation, ask new:
        if (! useNotation) {
            setTimeout( () => renew(possibleChords), 1000  );
        }


    };

    // progression exercises
    // - peavad tulema sissemängitud näidetest, sest häälejuhtimist jms, et saa automaatselt niimoodi moodustada.
    // Sibelius -> midi export?
    // vaja siis: notatsioon -> VexFlow -> + helifail/või MIDI mängimine VexFlowst
    // harjutuse objekt nt: { answer: "T T D", notation: VexTabString, sound: "playFromVF"|soundFile  }
    // helifailide kataloog vastavalt harjutste struktuurile

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

    //TODO: long or short notes...
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
        console.log('start csound')
        if (csound) {
            await loadResources(csound, 60, 84, "oboe");

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


    const createPlaySoundButton = () => {
        console.log("Begun: ", exerciseHasBegun);
        // console.log("Begun: ", exerciseHasBegun());
        // if (exerciseHasBegun()) {
        if (exerciseHasBegun) {
            return (
                <Grid.Row  columns={2} centered={true}>
                    <Grid.Column>
                        <Button color={"green"} onClick={() => renew(possibleChords)} className={"fullWidth marginTopSmall"} >{t("playNext")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => play(selectedChord, baseNote.midiNote)} className={"fullWidth marginTopSmall"}  >{t("repeat")}</Button>
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

    const createResponseButtons = () => {
        let rows = [];
        //TODO: NB! does not support odd number of chords
        for (let i = 0, n = possibleChords.length; i < n; i += 2) {
            const row = createResponseButtonRow(possibleChords[i], possibleChords[i + 1]);
            rows.push(row);
        }

        return rows;
    };

    const createResponseButtonRow = (chord1, chord2) => {
        return (
            <Grid.Row columns={2} className={"exerciseRow"}>
                {createResponseButtonColumn(chord1)}
                {createResponseButtonColumn(chord2)}
            </Grid.Row>
        )
    };

    const createResponseButtonColumn = (chord) => {
        return (
            <Grid.Column>
                <Button className={"fullWidth marginTopSmall" /*<- kuvab ok. oli: "exerciseBtn"*/}
                        key = {chord.shortName}
                        onClick={() => checkResponse({shortName: chord.shortName})}>{ capitalizeFirst( t(chord.longName) )}</Button>
            </Grid.Column>
        )
    };

    const createVolumeRow = () => {
        return (exerciseHasBegun)  ? (
            <Grid.Row centered={true} columns={3}>
                <Grid.Column>
                    {capitalizeFirst(t("instrument"))+": "}
                    <Dropdown
                        onChange={ async (event, data) => {
                            //console.log("New sound is: ", data.value)
                            if (csound) {
                                await loadResources(csound,  60, 84, data.value);
                            }
                        }
                        }
                        options ={ [
                            {text: t("flute"), value:"flute"},
                            {text: t("oboe"), value:"oboe"},
                            {text: t("violin"), value:"violin"},
                            {text: t("guitar"), value:"guitar"}
                        ]  }
                        defaultValue={"oboe"}

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

    const createNotationBlock = () => {
        if (useNotation) {
            return (
            <div>
                <div className={"marginTop"}>Sisesta noodid (nt. a c' es') ning klõpsa seejärel vasta akordi nupule</div>
                <Input
                    onChange={e => {setNotesEnteredByUser(e.target.value)}}
                    onKeyPress={ e=> { if (e.key === 'Enter') renderNotes()  }}
                    placeholder={'nt: a c\' es\''}
                    value={notesEnteredByUser}
                />
                <Button onClick={renderNotes}>{ capitalizeFirst( t("render") )}</Button>
                <Notation  className={"marginTopSmall"} notes={vexTabChord} width={200} visible={true} /*time={"4/4"} clef={"bass"} keySignature={"A"}*//>
            </div>
            );
        } else {
            return null;
        }
    }



    return (
        <div>
            {/*<Shortcuts
                name='AskChord'
                handler={handleShortcuts}
            />*/}
            <Header size='large'>{`${t(name)} `}</Header>

            <Grid>
                <Checkbox toggle
                          label={"Noteeri"}
                          defaultChecked={false}
                          className={"/*floatLeft */marginTop"}
                          onChange={ (e, {checked}) => setUseNotation(checked) }
                />
                <ScoreRow/>
                {/*Vaja rida juhiseks (exerciseDescriptio). div selleks ilmselt kehv, sest kattub teistega...*/}
                {createNotationBlock()}
                {createResponseButtons()}
                {createPlaySoundButton()}
                {createVolumeRow()}
                <Grid.Row>
                    <Grid.Column>

                        <GoBackToMainMenuBtn/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {/*<MIDISounds ref={midiSounds} appElementName="root" instruments={[3]} />*/}
        </div>

    );
};

export default AskChord;