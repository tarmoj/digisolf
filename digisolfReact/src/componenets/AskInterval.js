import React, { useState, useRef } from 'react';
import {Button, Grid, Header} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setComponent} from "../actions/component";
import MainMenu from "./MainMenu";
import {violinClefNotes} from "../util/notes";
import {getRandomElementFromArray, getRandomBoolean} from "../util/util";
import {getInterval} from "../util/intervals";
import MIDISounds from 'midi-sounds-react';
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";

const AskInterval = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const isHarmonic = useSelector(state => state.exerciseReducer.isHarmonic);
    const name = useSelector(state => state.exerciseReducer.name);

    const midiSounds = useRef(null);

    const [interval, setInterval] = useState({});
    const [isMajor, setIsMajor] = useState(true);
    const [selectedTonicNote, setSelectedTonicNote] = useState(null);
    const [intervalButtonsClicked, setIntervalButtonsClicked] = useState([]);
    const [greenIntervalButton, setGreenIntervalButton] = useState(null);

    const goBack = () => {
        dispatch(setComponent("MainMenu"));
    };

    const startExercise = () => {
        switch(name) {
            case "askIntervalTonicTriad":
                askIntervalTonicTriad();
                break;
            default:
                console.log("no exercise found");
        }
    };

    const askIntervalTonicTriad = () => {
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

        const newInterval = generateInterval(isMajor, selectedTonicNote, violinClefNotes);
        setInterval(newInterval);

        playInterval(newInterval);
    };

    const playInterval = (interval) => {
        if (isHarmonic) {
            playNote(interval.note1.midiNote, 0, 4);
            playNote(interval.note2.midiNote, 0, 4);
        } else {
            playNote(interval.note1.midiNote, 0, 2);
            // playNote(interval.note2.midiNote, 3, 2);
            playNote(interval.note2.midiNote, 2000, 2);
        }
    };

    const playNote = (midiNote, start, duration) => {
        setTimeout(() => {
            midiSounds.current.playChordNow(3, [midiNote], duration);
        }, start)
        // võibolla lihtsam vältida setTimeout ja: midiSound.current.playChordAt ?
        // midiSounds.current.playChordAt(start, 3, [midiNote], duration); // millegipärast ei tööta, kui korrata intervalli
    };

    const generateInterval = (isMajor, selectedTonicNote, possibleNotes) => {
        const triadNote = getTriadNote(isMajor, selectedTonicNote, possibleNotes);
        return getInterval(selectedTonicNote, triadNote);
    };

    const getTriadNote = (isMajor, tonicNote, possibleNotes) => {
        let newNote;
        let newNoteDiffersFromPrevious = false;

        while (newNote === undefined || !newNoteDiffersFromPrevious) {
            const newNoteMidiDifference = getRandomTriadNoteMidiDifference(isMajor);
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

    const getRandomTriadNoteMidiDifference = (isMajor) => {
        let possibleDifferences;

        if (isMajor) {
            possibleDifferences = [4, 7, -5, -8];
        } else {
            possibleDifferences = [3, 7, -5, -9];
        }

        return getRandomElementFromArray(possibleDifferences);
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
        if (exerciseHasBegun()) {
            // const correctInterval = getIntervalTranslation(interval.interval.longName);
            setIntervalButtonsClicked(intervalButtonsClicked.concat([answer]));

            if (answer === interval.interval.shortName) {
                // dispatch(setPositiveMessage(`${t("correctAnswerIs")} ${correctInterval}`, 5000));
                getNewInterval(isMajor, selectedTonicNote);
                colorCorrectAnswerGreen(answer);
                setIntervalButtonsClicked([]);
            } else {
                // dispatch(setNegativeMessage(`${t("correctAnswerIs")} ${correctInterval}`, 5000));
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

        const startExerciseButton = <Button key={"startExercise"} primary onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>;
        const changeKeyButton = <Button key={"changeKey"} primary onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("changeKey")}</Button>;
        const playNextIntervalButton = <Button key={"playNext"} color={"olive"} onClick={() => getNewInterval(isMajor, selectedTonicNote)} className={"fullWidth marginTopSmall"}>{t("playNext")}</Button>;
        const repeatIntervalButton = <Button key={"repeat"} color={"green"} onClick={() => playInterval(interval)} className={"fullWidth marginTopSmall"}>{t("repeat")}</Button>;

        const goBackButton = <Button key={"goBack"} onClick={goBack} className={"fullWidth marginTopSmall"}>{t("goBack")}</Button>;

        if (exerciseHasBegun()) {
            buttons.push(repeatIntervalButton, playNextIntervalButton, changeKeyButton);
        } else {
            buttons.push(startExerciseButton);
        }

        buttons.push(goBackButton);

        return buttons;
    };

    const exerciseHasBegun = () => {
        return selectedTonicNote !== null;
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
            <Header size='large'>{`${t(name)} - ${getExerciseType()}`}</Header>
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column/>
                    {createIntervalButton("p1", t("unison"))}
                </Grid.Row>
                <Grid.Row columns={2}>
                    {createIntervalButton("v2", `${t("minor")} ${t("second")}`)}
                    {createIntervalButton("s2", `${t("major")} ${t("second")}`)}
                </Grid.Row>
                <Grid.Row columns={2}>
                    {createIntervalButton("v3", `${t("minor")} ${t("third")}`)}
                    {createIntervalButton("s3", `${t("major")} ${t("third")}`)}
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column/>
                    {createIntervalButton("p4", `${t("perfect")} ${t("fourth")}`)}
                </Grid.Row>
                <Grid.Row columns={2}>
                    {createIntervalButton("<5", `${t("diminished")} ${t("fifth")}`)}
                    {createIntervalButton("p5", `${t("perfect")} ${t("fifth")}`)}
                </Grid.Row>
                <Grid.Row columns={2}>
                    {createIntervalButton("v6", `${t("minor")} ${t("sixth")}`)}
                    {createIntervalButton("s6", `${t("major")} ${t("sixth")}`)}
                </Grid.Row>
                <Grid.Row columns={2}>
                    {createIntervalButton("v7", `${t("minor")} ${t("seventh")}`)}
                    {createIntervalButton("s7", `${t("major")} ${t("seventh")}`)}
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column/>
                    {createIntervalButton("p8", t("octave"))}
                </Grid.Row>
                <Grid.Row>
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