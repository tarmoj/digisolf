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

    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED)


    // diktaatide definitsioonid võibolla eraldi failis.
    // kas notatsioon Lilypond või VT? pigem lilypond sest import musicXML-st lihtsam
    // vaja mõelda, milliline oleks diktaadifailide struktuur
    // midagi sellist nagu:
    // category: C-  classical, RM - rhythm music (pop-jazz) NB! categorys will most likely change!
    const categories = ["C_simple", "RM_simple"];

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

    ];



    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);

        // the initial category comes with the exercise name, maybe later user can change it
        if (categories.includes(name)) {
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

        setAnswered(false);
        setNotesEnteredByUser("");

        //const notationInfo =
        //setNotationInfo( {vtNotes: null});

        // uncommented for testing:
        //showFirstNote(dictationIndex);
        hideAnswer();
        const dictation = dictations[dictationIndex];

        setSelectedDictation(dictation);
//        console.log("Selected chord: ", t(selectedChord.longName), baseNote.midiNote );
        const answer = {notation: selectedDictation.notation};
        setAnswer(answer);
        if (exerciseHasBegun) {
            playSoundFile(dictation.soundFile);
        }

    };

    const showFirstNote= (dictationIndex) => {

        const notation =  parseLilypondString(dictations[dictationIndex].notation);
        const vtNotes = notation.vtNotes;
        const firstNote = vtNotes.slice(0, vtNotes.indexOf("/")+2);
        console.log("First note: ", firstNote );
        notation.vtNotes = firstNote;
        setNotationInfo(notation);
        //TODO: peaks sisestama ka taktimõõdu, helistiku ja esimese noodi sisestus-Inputi tekstiks ( notesEnteredByUser )

    };

    const hideAnswer = () => {
        setCorrectNotation({vtNotes: null});
    };

    const playSoundFile = (url) => {
        console.log("Play soundfile", url);
        setPlayStatus(Sound.status.PLAYING);
    };

    const stop = () => {
        console.log("Stop");
        setPlayStatus(Sound.status.STOPPED);
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





    // UI ======================================================

    const createPlaySoundButton = () => {
        console.log("Begun: ", exerciseHasBegun);

        if (exerciseHasBegun) {
            return (
                <Grid.Row  columns={3} centered={true}>
                    <Grid.Column>
                        <Button color={"green"} onClick={() => playSoundFile(selectedDictation.soundFile)} className={"fullWidth marginTopSmall"} >
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
            <Notation  className={"marginTopSmall"} width={600} scale={1}
                       notes={notationInfo.vtNotes}
                       time={notationInfo.time}
                       clef={notationInfo.clef}
                       keySignature={notationInfo.keySignature}/>
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