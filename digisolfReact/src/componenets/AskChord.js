import React, { useState, useRef } from 'react';
import {Button, Grid, Header} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setComponent} from "../actions/component";
import MainMenu from "./MainMenu";
import {getRandomElementFromArray, getRandomInt} from "../util/util";
import {chordDefinitions} from "../util/intervals";
import MIDISounds from 'midi-sounds-react';
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import {Artist, VexTab, Flow} from 'vextab/releases/vextab-div'


// tüüp 1: antakse ette noot ja suund, mängitakse akord
// kasutaja peab ehitama akordi (või vastama, mis see oli)
// lihtsaim variant: mängib akordi, vasta, kas maz või min
// tüüp 2: antakse akordijärgnevus, tuvasta, mis funtsioonid (T, D, S, M)
const AskChord = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const name = useSelector(state => state.exerciseReducer.name);
    const midiSounds = useRef(null);

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [possibleChords, setPossibleChords] = useState([]);
    const [selectedChord, setSelectedChord] = useState([]);
    const [answer, setAnswer] = useState(null);
    const [baseMidiNote, setBaseMidiNote] = useState(60);


    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);
        // what is right place for setting the volume?
        midiSounds.current.setMasterVolume(0.3); // not too loud TODO: add control slider

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
            default:
                console.log("no exercise found");
                return;
        }

        setPossibleChords(possibleChords);

        renew(possibleChords);

        vexTabTest();

    };

    const vexTabTest = () => {

        const div = document.getElementById("vf")

        console.log("Artist: ", typeof(Artist),typeof (VT));
        //const VexTab = VT.VexTab;
        //const Artist = VT.Artist;
        console.log("Type of VexTabDiv", typeof (VexTabDiv), typeof (VexTab));
        const Renderer =  Flow.Renderer;   //Vex.Flow.Renderer;
        // = VexTabDiv.Vex.Flow.Renderer; - error: vextab__WEBPACK_IMPORTED_MODULE_11___default.a.Vex is undefined

// Create VexFlow Renderer from canvas element with id #boo.
        const renderer = new Renderer(div, Renderer.Backends.SVG);

// Initialize VexTab artist and parser.
        const artist = new Artist(10, 10, 600, {scale: 0.8}); // this seems not to work...
        const vextab = new VexTab(artist);

        try {
            // Parse VexTab music notation passed in as a string.
            vextab.parse("stave \n notes :q  D-E-F#-G/4\n")

            // Render notation onto canvas.
            artist.render(renderer);
        } catch (e) {
            console.log(e);
        }
    };



    // renew generates answer and performs play/show
    const renew = (possibleChords) =>  {
        const midiNote = getRandomInt(53, 72); // TODO: make the range configurable
        setBaseMidiNote(midiNote);
        const selectedChord = getRandomElementFromArray(possibleChords);
        setSelectedChord(selectedChord);
        console.log("Selected chord: ", t(selectedChord.longName), baseMidiNote, midiNote );
        const answer = {shortName: selectedChord.shortName}; // may be different in different exercised, might need switch/case
        setAnswer(answer);
        play(selectedChord, midiNote);
    };

    // what is more generic name -  perform? execute? present?
    const play = (selectedChord, baseMidiNote=60) => {
        const duration = 4; // TODO: make configurable
        const midiNotes = [];
        for (let midiInterval of selectedChord.midiIntervals) { // nootide kaupa basenote + interval
            midiNotes.push(baseMidiNote + midiInterval);
        }
        console.log("Midinotes played: ", midiNotes, baseMidiNote, selectedChord.shortName);
        midiSounds.current.playChordNow(3, midiNotes, duration);
    };

    const checkResponse = (response) => { // response is an object {key: value [, key2: value, ...]}
        //console.log(response);
        const correctChord = t(selectedChord.longName); // TODO: translation

        if ( JSON.stringify(response) === JSON.stringify(answer)) {
            dispatch(setPositiveMessage(`${t("correctAnswerIs")} ${correctChord}`, 5000));
        } else {
            dispatch(setNegativeMessage(`${t("correctAnswerIs")} ${correctChord}`, 5000));
        }
    };

    // progression exercises
    // - peavad tulema sissemängitud näidetest, sest häälejuhtimist jms, et saa automaatselt niimoodi moodustada.
    // Sibelius -> midi export?
    // vaja siis: notatsioon -> VexFlow -> + helifail/või MIDI mängimine VexFlowst
    // harjutuse objekt nt: { answer: "T T D", notation: VexTabString, sound: "playFromVF"|soundFile  }
    // helifailide kataloog vastavalt harjutste struktuurile



    // UI ======================================================

    const goBack = () => {
        dispatch(setComponent("MainMenu"));
    };

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
                        <Button onClick={() => play(selectedChord, baseMidiNote)} className={"fullWidth marginTopSmall"}  >{t("repeat")}</Button>
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

        for (let i = 0, n = possibleChords.length; i < n; i += 2) {
            const row = createResponseButtonRow(possibleChords[i], possibleChords[i + 1]);
            rows.push(row);
        }

        return rows;
    };

    const createResponseButtonRow = (chord1, chord2) => {
        return (
            <Grid.Row columns={2}>
                {createResponseButtonColumn(chord1)}
                {createResponseButtonColumn(chord2)}
            </Grid.Row>
        )
    };

    const createResponseButtonColumn = (chord) => {
        return (
            <Grid.Column>
                <Button className={"exerciseBtn"}
                        onClick={() => checkResponse({shortName: chord.shortName})}>{t(chord.longName)}</Button>
            </Grid.Column>
        )
    };


    return (
        <div>

            <Header size='large'>{`${t(name)} `}</Header>
            <div id={"vf"}>SCORE</div>
            <Grid>
                {createResponseButtons()}

                {createPlaySoundButton()}
                <Grid.Row>
                    <Grid.Column>

                        <Button onClick={goBack} className={"fullWidth marginTopSmall"}>{t("goBack")}</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <MIDISounds ref={midiSounds} appElementName="root" instruments={[3]} />
        </div>

    );
};

export default AskChord;