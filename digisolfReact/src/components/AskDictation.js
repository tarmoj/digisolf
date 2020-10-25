import React, {useState, useRef, useEffect} from 'react';
import {Button, Grid, Header, Input, Popup} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {capitalizeFirst} from "../util/util";
import {getNoteByName, parseLilypondString} from "../util/notes";
//import MIDISounds from 'midi-sounds-react';
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import ScoreRow from "./ScoreRow";
import Notation from "./Notation";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import Sound from 'react-sound';
import Select from "semantic-ui-react/dist/commonjs/addons/Select";
import dictation1a from "../sounds/dictations/1a.mp3";
import {useParams} from "react-router-dom";
import CsoundObj from "@kunstmusik/csound";
import {makeInterval,  scaleDefinitions} from "../util/intervals";
import * as notes from "../util/notes";

// move the csound orchestra to separate file and import

const orc = `
sr=48000
ksmps=128
0dbfs=1
nchnls=2
gkMayPlay init 0

giNotes[] array 60, 65, 67, 62, 60
gaSignal[] init 2

;schedule "PlaySequence", 0, 0, 1

; TODO: call instruments in real time, metro, that takes the tempo
; then Stop turns off PlaySequence
instr PlaySequence ; plays the notes (MIDI NN) from array giNotes

gkMayPlay init 1


iBeatDuration = (p4==0) ? 1 : p4
index = 0
iStart = 0
while (index < lenarray(giNotes) ) do
schedule "PlayNote", iStart, iBeatDuration, giNotes[index]
iStart += iBeatDuration
index += 1 
od
endin


instr PlayNote ; p4 - notenumber
; TODO: volume
iNote = p4

if (gkMayPlay==0) then
    turnoff 
endif

Sfile sprintf "%d.ogg", iNote
prints Sfile
iDuration filelen Sfile
print iDuration
aSignal[] diskin2 Sfile

;aSignal[] init 2
;aSignal[0] = poscil:a(0.3, cpsmidinn(iNote))
;aSignal[1] = aSignal[0]
gaSignal = aSignal
;TODO: check for channels
; TODO declick
out aSignal*linen:a(1, 0.05, p3, 0.3)
endin

instr Stop
    gkMayPlay init 0
endin


schedule "Reverb", 0, -1
instr Reverb
iReverbLevel = 0.2
iSize = 0.6
aRvbL, aRvbR reverbsc gaSignal[0]*iReverbLevel , gaSignal[1]*iReverbLevel, iSize, 12000
out aRvbL, aRvbR
gaSignal[0] = 0
gaSignal[1] = 0
endin


`;



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

    const [notesEnteredByUser, setNotesEnteredByUser] = useState(""); // test
    const [notationInfo, setNotationInfo] = useState({  clef:"treble", time: "4/4", vtNotes: "" });
    const [correctNotation, setCorrectNotation] = useState({  clef:"treble", time: "4/4", vtNotes: "" });

    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);



    // diktaatide definitsioonid võibolla eraldi failis.
    // kas notatsioon Lilypond või VT? pigem lilypond sest import musicXML-st lihtsam
    // vaja mõelda, milliline oleks diktaadifailide struktuur
    // midagi sellist nagu:
    // category: C-  classical, RM - rhythm music (pop-jazz) NB! categorys will most likely change!
    const categories = ["1voice", "2voice", "classical", "popJazz", "functional", "C_simple", "RM_simple", "degrees"];

    const dictations = [
        {category: "C_simple", title: "1a",
            soundFile: dictation1a,
            //soundFile: "../digisolf/sounds/dictations/1a.mp3",
            notation:
        ` \\time 4/4 
        c d c e | c g e r \\bar "|."
        `
        },
        {   category: "C_simple",
            title: "2a", soundFile: "../sounds/dictations/2a.mp3", notation: // url was: ../digisolf/sounds/
                `
                \\time 4/4
                c e g c | h, c g, r \\bar "|."  
        `
        },
        { category: "C_simple", title: "3c", soundFile: "../sounds/dictations//3c.mp3", notation:
                `
                \\time 4/4
                c' e' d' c' | g f e  r \\bar "|."  
        `
        },
        { category: "C_simple", title: "4b", soundFile: "../sounds/dictations/4b.mp3", notation:
                `  
                \\time 4/4
                a, h, c e | f a gis r \\bar "|."
        `
        },
        { category: "C_simple", title: "5a", soundFile: "../sounds/dictations/5a.mp3", notation:
                `
                \\time 4/4
                a, c e gis, | h, e  a, r \\bar "|."  
        `
        },

        { category: "C_simple", title: "14a", soundFile: "../sounds/dictations/14a.mp3", notation:
                `
                \\time 3/4
                a,8 h, c c h, c | a,4 a, r | a,8 g, c h, c d | e4 e r \\bar "|."   
        `
        },

        // TEST: kahehäälne ühel süsteemil. Notatsioon praegu VexTab
        //NB! helifal praegu vale!
        { category: "C_simple",
            title: "2v 1a",
            soundFile: "../sounds/dictations/14a.mp3",
            notationType: "vextab", // vextab VT or lilypond
            notation:
                `
stave time=4/4
voice
notes :4 E/4 F/4 G/4 A/4 | G/4 F/4 :2 G/4 

voice 
notes :4 C/4 D/4 E/4 F/4 | E/4 D/4 :2 E/4    
        `
        },

        // RM Tõnu näide
        {category: "RM_simple", title: "Smilers", soundFile: "../sounds/dictations/Smilers.mp3",
            credits: "Hendriks Sal-Saller \"Käime katuseid mööda\"",
            notation:
                `
                \\time 4/4 \\key g \major
                r8 h16 h  h a g a~  a8 h r4 |
                r8 h16 h  h16 h h8 d'16 d'8 d'16~ d'16 d e8~ |
                e4 r4 r r \\bar "|."  
        `,
            chords: [
                {bar: 1, beat: 1, chord: "G"},
                {bar: 3, beat: 1, chord: "C"}
            ],
            melody: ",33,3212_,23/33,333,555_,556_/1,,,", // miks lõpus 1, pekas ju 6 olema
            rhythm: "34,1234_,13,/34,123,124_,123_/1,,,/"

        },

        // degree dictations
        {category: "degrees_level1", title: "1",
            //soundFile: "",
            //notation: "", // vist ikka vaja et oleks notatsioon ja selle järgi leiab MIDI noodid
            degrees: "1 2 3 2 1 -7 1 ",
            tonicVtNote: "C/5", // kas vaja
            scale: "major", // need for corret ynames: major, minor, ionia, locria, lydia, etc
        },
        {category: "degrees_level1", title: "2",
            //soundFile: "",
            //notation: "",
            tonicVtNote: "C/5",
            degrees: "1 2 1 -7   -6 -5 1 ",
            scale: "major", // need for corret ynames: major, minor, ionia, locria, lydia, etc
        },



    ];



    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);

        if (name.toString().startsWith("degrees") ) {
            console.log("Trying to start Csound");
            startCsound();
        }

        // the initial category comes with the exercise name, maybe later user can change it
        if (categories.includes(name.split("_")[0])) {
            setCurrentCategory(name);
        } else {
            console.log("Unknown dictation category: ", name);
            return;
        }
        //const firstInCategory = dictations.findIndex(  dict =>  dict.category=== name);
        //renew(firstInCategory);
    };

    // ilmselt selles tüübis ei võta juhuslikult vaid mingi menüü, kust kasutaja saab valida
    // võib mõelda ka juhuslikult moodustamise tüübi peale, aga siis ei saa kasutada vist päris pille
    const renew = (dictationIndex) =>  {
        console.log("Renew: ", dictationIndex);
        setAnswered(false);
        setNotesEnteredByUser("");
        const dictation = dictations[dictationIndex];


       if (dictation.category.startsWith("degrees")) { // degree dictations -  generate notation from dictation.degrees
           // leia noodid vastavalt laadi astmete intervallidele
           // TODO: take tonicVtNote form given array major: [C, G, F ], minor: [a, e, d] etc
           const melodyNotes =  degreesToNotes(dictation.degrees, dictation.scale, dictation.tonicVtNote );
           let notation = "stave time=4/4\nnotes :4 "; // TODO: key
           let midiNotes = [];
           let i=0;
           // maybe it is better to form the notationString also in degreesToNotes and return 3 arrays -
           // midiNotes[], vtNotationString
           const melodyDegrees = dictation.degrees.trim().split(/[ ,]+/); // split by comma or white space
           for (let note of melodyNotes) {
               // TODO: construct notation of the dictation here
               console.log("Melody: ", note.vtNote);
               notation += ` ${note.vtNote}  $ ${Math.abs(melodyDegrees[i++]) } $ `;
               midiNotes.push(note.midiNote);
               //setNotationInfo({time: "4/4", vtNotes: vtNotes});
               //
           }
           console.log("Constructed notation: ", notation);
           dictation.notation = notation;
           dictation.midiNotes = midiNotes;
           // see ei tööta nii, vt showDictation
           // ssetCorrectNotation({vtNotes: selectedNotes.join(" ") });

       }

        setSelectedDictation(dictation);

        // uncommented for testing:
        showFirstNote(dictationIndex);
        hideAnswer();

//        console.log("Selected chord: ", t(selectedChord.longName), baseNote.midiNote );
        const answer = {notation: selectedDictation.notation};
        setAnswer(answer);
        if (exerciseHasBegun) {
            play();
            //playSoundFile(dictation.soundFile);
        }

    };

    const degreesToNotes = ( degreeString, scale, tonicVtNote) => { // returns array of note objects according to the degree-melody
        if (scaleDefinitions.hasOwnProperty(scale) ) {
            let melodyNotes = [];
            const baseNote = notes.getNoteByVtNote(tonicVtNote);
            const melodyDegrees = degreeString.trim().split(/[ ,]+/); // split by comma or white space
            for (let degree of melodyDegrees) {
                if (degree < -7 || degree > 7  ) {
                    console.log("Wrong degree: ", degree);
                    break;
                }
                const interval = scaleDefinitions[scale][Math.abs(degree)-1];
                if (interval) {
                    let degreeNote =  makeInterval(baseNote, interval, "up"); // what if bass clef?
                    if (degree<0) { // below tonic
                        degreeNote =  makeInterval(degreeNote, "p8", "down");
                    }
                    console.log("Tonic, Interval, note: ", tonicVtNote, interval, degreeNote.vtNote );
                    melodyNotes.push(degreeNote);
                } else {
                    console.log("Could not find interval for scale, degree: ", scale, degree);
                }
            }
            return melodyNotes;
        } else {
            console.log("Could not find scale: ", scale );
            return [];
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
    const play = () => {
        if (name.startsWith("degrees")) {
            playCsoundSequence();
        } else {
            playSoundFile(selectedDictation.soundFile);
        }
    };

    const playSoundFile = (url) => { // why is here url? Sound.url is probably already set somewhere...
        console.log("Play soundfile", url);
        setPlayStatus(Sound.status.PLAYING);
    };

    const playTonic = (tonicMidiNote, duration=1) => {
        const scoreLine = `i 2 0 ${duration} ${tonicMidiNote}`;
        console.log("Play tonic in Csound: ", scoreLine);
        if (csound) {
            csound.readScore(scoreLine);
        } else {
            console.log("csound is null");
        }
    }

    const playCsoundSequence = (startTime = 0, beatLength=1) => {
        const dictation = selectedDictation; //dictations[dictationIndex];
        if ( dictation.hasOwnProperty("midiNotes") ) {
            const compileString = `giNotes[] fillarray ${dictation.midiNotes.join(",")}`;
            console.log("Compile: ", compileString);
            csound.compileOrc(compileString);
            csound.readScore(`i 1 ${startTime} 0 ${beatLength} `);
        }
    };

    const stop = () => {
        console.log("Stop");
        if (name.toString().startsWith("degrees")) {
            if (csound) {
                csound.readScore("i \"Stop\" 0  0.1");
            }
        } else {
            setPlayStatus(Sound.status.STOPPED);
        }
    };

    const answerIsHidden = () => {
        return correctNotation.vtNotes === null || correctNotation.vtNotes === "";
    };

    const showDictation = () => {
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
            //
            console.log("Õiged noodid: ", notationInfo.vtNotes);
            if (notationInfo.vtNotes) {
                setCorrectNotation(notationInfo);
            }
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

    //const [csoundStarted, setCsoundStarted] = useState(false);
    const [csound, setCsound] = useState(null);

    useEffect(() => {
        if (csound == null) {
            CsoundObj.initialize().then(() => {
                const cs = new CsoundObj();
                const data = [1,2,3];
                setCsound(cs);
            });
        }
    }, [csound]);

    useEffect(() => {
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
        for (let i = startinNote; i <= endingNote; i++) {
            const fileUrl = "sounds/instruments/" + instrument + "/" + i + ".ogg";
            const serverUrl = `${process.env.PUBLIC_URL}/${fileUrl}`;
            console.log("Trying to load URL ",serverUrl);
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
        await loadResources(csound, 60, 84, "flute");

        csound.compileOrc(orc);
        csound.start();
        csound.audioContext.resume();
        //setCsoundStarted(true);
    };



    // UI ======================================================

    const createPlaySoundButton = () => {
        console.log("Begun: ", exerciseHasBegun);

        if (exerciseHasBegun) {
            return (
                <Grid.Row  columns={3} centered={true}>
                    <Grid.Column>
                        <Button color={"green"} onClick={() => play()} className={"fullWidth marginTopSmall"} >
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

    const createNotationBlock = () => {
        const answerDisplay = answerIsHidden() ? "none" : "inline";
        const notationDisplay = true; //name.startsWith("degrees") ? "none" : "inline";

        return exerciseHasBegun ? (
        <div >
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
            <div style={{display: notationDisplay}}>
            <Notation  className={"marginTopSmall"} width={600} scale={1}
                       notes={notationInfo.vtNotes}
                       time={notationInfo.time}
                       clef={notationInfo.clef}
                       keySignature={notationInfo.keySignature}/>
            </div>
            <div style={{display: answerDisplay}}>
               <Notation className={"marginTopSmall"} width={600} scale={1}
                         notes={correctNotation.vtNotes}
                         time={correctNotation.time}
                         clef={correctNotation.clef}
                         keySignature={correctNotation.keySignature}/>
            </div>
        </div>
        ) : null;
    };

    const createSelectionMenu = () => {
        const options = []; //"[";
        console.log("createSelectionMenu for: ", currentCategory, name);
        //const dictationsByCategory =  dictations.filter(dict =>  dict.category=== currentCategory);
        for (let i=0; i< dictations.length; i++) {
            if (dictations[i].category === name) { // exercise's name contains also the category; later support changing the category
                options.push( { value: i, text: dictations[i].title  } );
            }
        }

        return (
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

            {/*{ csound == null ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : (
                csoundStarted ? (
                    <button onClick={renew(1)}>NEW</button>
                ) : (
                    <button onClick={startCsound}>START Csound</button>
                )
            )}*/}

            <Grid>
                <ScoreRow/>
                {createSelectionMenu()}
                {createNotationBlock()}
                {createPlaySoundButton()}
                <Grid.Row>
                    <Grid.Column>
                        <GoBackToMainMenuBtn/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>

    );
};

export default AskDictation;