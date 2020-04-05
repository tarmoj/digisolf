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
    const isTonic = useSelector(state => state.exerciseReducer.isTonic);
    const name = useSelector(state => state.exerciseReducer.name);

    const midiSounds = useRef(null);

    const [interval, setInterval] = useState({});
    const [isMajor, setIsMajor] = useState(true);
    const [selectedTonicNote, setSelectedTonicNote] = useState(null);

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
        const selectedTonicNote = getRandomElementFromArray(tonicNotes);	// Select random note from tonic notes
        midiSounds.current.setMasterVolume(0.4); // not too loud TODO: add control slider
        getNewInterval(isMajor, selectedTonicNote);
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
            playNote(interval.note2.midiNote, 2000, 2);
        }
    };

    const playNote = (midiNote, start, duration) => {
        setTimeout(() => {
            midiSounds.current.playChordNow(3, [midiNote], duration);
        }, start)
        // võibolla lihtsam vältida setTimeout ja: midiSound.current.playChordAt ?
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
                let previousIntervalExists = Object.keys(interval).length > 0;

                if (previousIntervalExists) {
                    if (previousIntervalExists && newNote.midiNote === interval.note2.midiNote) {
                        newNoteDiffersFromPrevious = false;
                    }
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
            const correctInterval = getIntervalTranslation(interval.interval.longName);

            if (answer === interval.interval.shortName) {
                dispatch(setPositiveMessage(`${t("correctAnswerIs")} ${correctInterval}`, 5000));
            } else {
                dispatch(setNegativeMessage(`${t("correctAnswerIs")} ${correctInterval}`, 5000));
            }
        }
    };

    const getIntervalTranslation = (longName) => {
        const parts = longName.split(" ");
        return `${t(parts[0])} ${t(parts[1])}`
    };

    const createPlayNextButton = () => {
        if (exerciseHasBegun()) {
            return <Button color={"green"} onClick={() => getNewInterval(isMajor, selectedTonicNote)} className={"fullWidth marginTopSmall"}>{t("playNext")}</Button>
        } else {
            return <Button color={"green"} onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>
        }
    };

    const createButtons = () => {
        let buttons = [];

        const startExerciseButton = <Button primary onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>;
        const changeKeyButton = <Button primary onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("changeKey")}</Button>;
        const playNextIntervalButton = <Button color={"olive"} onClick={() => getNewInterval(isMajor, selectedTonicNote)} className={"fullWidth marginTopSmall"}>{t("playNext")}</Button>;
        const repeatIntervalButton = <Button color={"green"} onClick={() => playInterval(interval)} className={"fullWidth marginTopSmall"}>{t("repeat")}</Button>;

        const goBackButton = <Button onClick={goBack} className={"fullWidth marginTopSmall"}>{t("goBack")}</Button>;

        if (exerciseHasBegun()) {
            buttons.push([repeatIntervalButton, playNextIntervalButton, changeKeyButton]);
            buttons.push();
        } else {
            buttons.push([startExerciseButton]);
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

    return (
        <div>
            <Header size='large'>{`${t(name)} - ${getExerciseType()}`}</Header>
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column>

                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("p1")} className={"exerciseBtn"}>{t("unison")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("v2")} className={"exerciseBtn"}>{t("minor")} {t("second")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("s2")} className={"exerciseBtn"}>{t("major")} {t("second")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("v3")} className={"exerciseBtn"}>{t("minor")} {t("third")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("s3")} className={"exerciseBtn"}>{t("major")} {t("third")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>

                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("p4")} className={"exerciseBtn"}>{t("perfect")} {t("fourth")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("<5")} className={"exerciseBtn"}>{t("diminished")} {t("fifth")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("p5")} className={"exerciseBtn"}>{t("perfect")} {t("fifth")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("v6")} className={"exerciseBtn"}>{t("minor")} {t("sixth")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("s6")} className={"exerciseBtn"}>{t("major")} {t("sixth")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("v7")} className={"exerciseBtn"}>{t("minor")} {t("seventh")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("s7")} className={"exerciseBtn"}>{t("major")} {t("seventh")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>

                    </Grid.Column>
                    <Grid.Column>
                        <Button onClick={() => setAnswer("p8")} className={"exerciseBtn"}>{t("octave")}</Button>
                    </Grid.Column>
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