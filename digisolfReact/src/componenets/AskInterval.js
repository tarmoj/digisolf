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

    const [interval, setInterval] = useState(null);

    const midiSounds = useRef(null);

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
        const interval = getNewInterval(isMajor, selectedTonicNote, violinClefNotes);
        setInterval(interval);
        console.log(interval.note1)
        console.log(interval.note2)

        playNote(interval.note1.midiNote, 0, 4);
        playNote(interval.note2.midiNote, 0, 4);
    };

    const playNote = (midiNote, start, duration) => {
        midiSounds.current.playChordNow(3, [midiNote], duration);
    };

    const getNewInterval = (isMajor, selectedTonicNote, possibleNotes) => {
        const triadNote = getTriadNote(isMajor, selectedTonicNote, possibleNotes);
        return getInterval(selectedTonicNote, triadNote);
    };

    const getTriadNote = (isMajor, tonicNote, possibleNotes) => {
        let newNote;

        while (newNote === undefined) {
            const newNoteMidiDifference = getRandomTriadNoteMidiDifference(isMajor);
            const newNoteMidiValue = tonicNote.midiNote + newNoteMidiDifference;
            newNote = possibleNotes.find(note => note.midiNote === newNoteMidiValue);
        }

        return newNote;
    };

    const getRandomTriadNoteMidiDifference = (isMajor) => {
        let possibleDifferences;

        if (isMajor) {
            possibleDifferences = [4, 7, 12, -5, -8, -12];
        } else {
            possibleDifferences = [3, 7, 12, -5, -9, -12];
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
        if (interval !== null) {    // Exercise has begun
            const correctInterval = getIntervalTranslation(interval.interval.longName);

            if (answer === interval.interval.shortName) {
                dispatch(setPositiveMessage(`${t("correctAnswerWas")} ${correctInterval}`));
            } else {
                dispatch(setNegativeMessage(`${t("correctAnswerWas")} ${correctInterval}`));
            }
        }
    };

    const getIntervalTranslation = (longName) => {
        const parts = longName.split(" ");
        return `${t(parts[0])} ${t(parts[1])}`
    };

    return (
        <div className={"exerciseBtns"}>
            <Header size='large'>{t(name)}</Header>
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
                        <Button onClick={startExercise} className={"fullWidth marginTop"}>{t("startExercise")}</Button>
                        <Button onClick={goBack} className={"fullWidth marginTop"}>{t("goBack")}</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <MIDISounds ref={midiSounds} appElementName="root" instruments={[3]} />
        </div>
    );
};

export default AskInterval