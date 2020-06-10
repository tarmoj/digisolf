import React, {useState, useRef, useEffect} from 'react';
import {Button, Divider, Grid, Header, Icon, Radio, Transition} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setComponent} from "../actions/component";
import MainMenu from "./MainMenu";
import {violinClefNotes} from "../util/notes";
import {getRandomElementFromArray, getRandomBoolean, capitalizeFirst} from "../util/util";
import {getInterval, simplifyIfAugmentedIntervals} from "../util/intervals";
import MIDISounds from 'midi-sounds-react';
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import ScoreRow from "./ScoreRow";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import { useParams } from "react-router-dom";

const AskInterval = () => {
    const { exerciseName } = useParams();


    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const isHarmonic = useSelector(state => state.exerciseReducer.isHarmonic);
    // const exerciseName = useSelector(state => state.exerciseReducer.name);

    const midiSounds = useRef(null);

    const [interval, setInterval] = useState({});
    const [isMajor, setIsMajor] = useState(true);
    const [selectedTonicNote, setSelectedTonicNote] = useState(null);
    const [intervalButtonsClicked, setIntervalButtonsClicked] = useState([]);
    const [greenIntervalButton, setGreenIntervalButton] = useState(null);
    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);

    const startExercise = () => {
        setExerciseHasBegun(true);

        const octaveNotes = violinClefNotes.slice(0, 21);	// First octave
        const tonicNote =  getRandomElementFromArray(octaveNotes);	// Select random note from octave as tonic note
        const tonicNotes = getAllNotesWithSameName(tonicNote, violinClefNotes);	// Get all tonic notes
        const isMajor = getRandomBoolean();

        const changeKey = selectedTonicNote !== null;
        let newSelectedTonicNote = getRandomElementFromArray(tonicNotes);	// Select random note from tonic notes

        while (changeKey && newSelectedTonicNote === selectedTonicNote) {
            newSelectedTonicNote = getRandomElementFromArray(tonicNotes);
        }

        midiSounds.current.setMasterVolume(0.4); // not too loud TODO: add control slider
        getNewInterval(isMajor, newSelectedTonicNote);
    };

    const getNewInterval = (isMajor, selectedTonicNote) => {
        setIsMajor(isMajor);
        setSelectedTonicNote(selectedTonicNote);

        let firstNote;
        let possibleSecondNotes;
        if (exerciseName === "allScaleDegrees") {
            firstNote = getRandomNoteInKey(selectedTonicNote);
            possibleSecondNotes = violinClefNotes.filter(note =>
                Math.abs(note.midiNote - firstNote.midiNote) < 12 &&    // Interval is less than octave
                note.midiNote !== firstNote.midiNote)                      // Interval is not unison
        } else {
            firstNote = selectedTonicNote;
            possibleSecondNotes = violinClefNotes;
        }

        const secondNote = getSecondNote(selectedTonicNote, possibleSecondNotes);
        const newInterval = getInterval(firstNote, secondNote);

        console.log("Key:", selectedTonicNote.vtNote, isMajor ? "major" : "minor");
        console.log("Note1", firstNote.vtNote);
        console.log("Note2", secondNote.vtNote);
        console.log("Played interval:", newInterval.interval.shortName);
        setInterval(newInterval);

        playInterval(newInterval);
    };

    const playInterval = (interval) => {
        setTimeout(() => {
            if (isHarmonic) {
                playNote(interval.note1.midiNote, 0, 2);
                playNote(interval.note2.midiNote, 0, 2);
            } else {
                playNote(interval.note1.midiNote, 0, 1);
                playNote(interval.note2.midiNote, 1, 1); // start sekundites
            }
        }, 300);    // Short user-friendly delay before start
    };

    const playNote = (midiNote, start, duration) => { // start peaks olema sekundites
        midiSounds.current.playChordAt (midiSounds.current.contextTime()+start, 3, [midiNote], duration); // millegipärast ei tööta, kui korrata intervalli
    };

    const getSecondNote = (tonicNote, possibleNotes) => {
        let newNote;
        let newNoteDiffersFromPrevious = false;

        while (newNote === undefined || !newNoteDiffersFromPrevious) {
            const newNoteMidiDifference = getRandomMidiDifference();
            const newNoteMidiValue = tonicNote.midiNote + newNoteMidiDifference;
            newNote = possibleNotes.find(note => note.midiNote === newNoteMidiValue);

            if (newNote !== undefined) {
                newNoteDiffersFromPrevious = true;
                const previousIntervalExists = Object.keys(interval).length > 0;

                if (previousIntervalExists && newNote.midiNote === interval.note2.midiNote) {
                    newNoteDiffersFromPrevious = false;
                }
            }
        }

        return newNote;
    };

    const getRandomMidiDifference = () => {
        let possibleDifferences;
        if (exerciseName === "tonicTriad") {
            possibleDifferences = getPossibleTriadNoteMidiDifferences();
        } else if (exerciseName === "tonicAllScaleDegrees" || exerciseName === "allScaleDegrees") {
            possibleDifferences = getPossibleScaleNoteMidiDifferences();
        }

        return getRandomElementFromArray(possibleDifferences);
    };

    const getRandomNoteInKey = (tonicNote) => {
        let note;
        while (note === undefined) {
            const possibleSemitoneDifferences = getPossibleScaleNoteMidiDifferences().concat([0]);   // Include tonic note
            const semiToneDifferenceFromTonicNote = getRandomElementFromArray(possibleSemitoneDifferences);
            const noteMidiValue = tonicNote.midiNote + semiToneDifferenceFromTonicNote;
            note = violinClefNotes.find(note => note.midiNote === noteMidiValue);
        }

        return note;
    };

    // const getRandomSemitoneDifference = (maxDifference, includeNegative = true) => {
    //     let differenceInSemitones = Math.floor(Math.random() * maxDifference) + 1;
    //     if (includeNegative) {
    //         differenceInSemitones *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    //     }
    //
    //     return differenceInSemitones;
    // };

    const getPossibleTriadNoteMidiDifferences = () => {
        return isMajor ? [4, 7, -5, -8] : [3, 7, -5, -9];
    };

    const getPossibleScaleNoteMidiDifferences = () => {
        return isMajor ? [2, 4, 5, 7, 9, 11, -1, -3, -5, -7, -8, -10] : [2, 3, 5, 7, 8, 11, -1, -4, -5, -7, -9, -10]; // Kõrge 7. aste minoori puhul
    };

    const getAllNotesWithSameName = (note, noteArray) => {
        let notes = [];

        for (let i = 0; i < noteArray.length; i++) {
            if (noteArray[i].vtNote.substring(0, noteArray[i].vtNote.length - 1) === note.vtNote.substring(0, note.vtNote.length - 1)) {
                notes.push(noteArray[i]);
            }
        }

        return notes;
    };

    const setAnswer = (answer) => {
        if (exerciseHasBegun) {
            // const correctInterval = getIntervalTranslation(interval.interval.longName);
            setIntervalButtonsClicked(intervalButtonsClicked.concat([answer]));

            if (answer === simplifyIfAugmentedIntervals(interval.interval.shortName)) {
                // dispatch(setPositiveMessage(`${t("correctAnswerIs")} ${correctInterval}`, 5000));
                getNewInterval(isMajor, selectedTonicNote);

                colorCorrectAnswerGreen(answer);
                setIntervalButtonsClicked([]);
                dispatch(incrementCorrectAnswers());
            } else {
                // dispatch(setNegativeMessage(`${t("correctAnswerIs")} ${correctInterval}`, 5000));
                dispatch(incrementIncorrectAnswers());
            }
        }
    };

    const colorCorrectAnswerGreen = (interval) => {
        setGreenIntervalButton(interval);
        setTimeout(() => {  // Set button color grey after some time
            setGreenIntervalButton(null);
        }, 2000)
    };

    const getIntervalTranslation = (longName) => {
        const parts = longName.split(" ");
        return `${t(parts[0])} ${t(parts[1])}`
    };

    const createButtons = () => {
        let buttons = [];

        const startExerciseButton = <Button key={"startExercise"} color={"green"} onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>;
        const changeKeyButton = <Button key={"changeKey"} primary onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("changeKey")}</Button>;
        const playNextIntervalButton = <Button key={"playNext"} color={"olive"} onClick={() => getNewInterval(isMajor, selectedTonicNote)} className={"fullWidth marginTopSmall"}>{t("playNext")}</Button>;
        const repeatIntervalButton = <Button key={"repeat"} color={"green"} onClick={() => playInterval(interval)} className={"fullWidth marginTopSmall"}>{t("repeat")}</Button>;

        if (exerciseHasBegun) {
            buttons.push(repeatIntervalButton, playNextIntervalButton, changeKeyButton);
        } else {
            buttons.push(startExerciseButton);
        }

        buttons.push(<GoBackToMainMenuBtn key={"goBack"}/>);

        return buttons;
    };

    const getExerciseType = () => {
        return isHarmonic ? t("harmonic") : t("melodic");
    };

    const getButtonColor = (buttonInterval) => {
        let color = "grey";
        const buttonHasBeenClicked = intervalButtonsClicked.some(interval => interval === buttonInterval);
        const buttonWasCorrectAnswer = greenIntervalButton === buttonInterval;

        if (buttonHasBeenClicked) {
            color = "red";
        } else if (buttonWasCorrectAnswer) {
            color = "green";
        }

        return color;
    };

    const createIntervalButton = (interval, displayedName) => {
        return (
            <Grid.Column>
                <Button color={getButtonColor(interval)} onClick={() => setAnswer(interval)} className={"exerciseBtn"}>{displayedName}</Button>
            </Grid.Column>
        )
    };

    return (
        <div>
            <Header size='large'>{`${t("setInterval")} ${t(exerciseName)} - ${getExerciseType()}`}</Header>
            <Grid>
                <ScoreRow showRadioButtons={true}/>
                <Grid.Row className={"exerciseRow"} columns={3}>
                    {/*TODO: support translation*/}
                    {createIntervalButton("v2", "v2")} {/*was: ${capitalizeFirst(t("minor"))} ${t("second")}*/}
                    {createIntervalButton("p4", "p4")}
                    {createIntervalButton("s2", "s2")}

                </Grid.Row>
                <Grid.Row className={"exerciseRow"} columns={3}>
                    {createIntervalButton("v3", "v3")}
                    {createIntervalButton("p5", "p5")}
                    {createIntervalButton("s3", "s3")}

                </Grid.Row>
                <Grid.Row className={"exerciseRow"} columns={3}>
                    {createIntervalButton("v6", "v6")}
                    {createIntervalButton("p8", "p8")}
                    {createIntervalButton("s6", "s6")}
                </Grid.Row>
                <Grid.Row className={"exerciseRow"} columns={3}>
                    {createIntervalButton("v7", "v7")}
                    {createIntervalButton(">5", "Trit. (>5/<4)")}
                    {createIntervalButton("s7", "s7")}
                </Grid.Row>
                <Grid.Row className={"exerciseRow"}>
                    <Grid.Column>
                        {createButtons()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <MIDISounds ref={midiSounds} appElementName="root" instruments={[3]} />
        </div>
    );
};

export default AskInterval