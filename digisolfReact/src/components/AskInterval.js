import React, {useState, useRef, useEffect} from 'react';
import {Button, Divider, Grid, Header, Icon, Input, Popup, Radio, Transition} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setComponent} from "../actions/component";
import MainMenu from "./MainMenu";
import {getNoteByVtNote} from "../util/notes";
import {getRandomElementFromArray, getRandomBoolean, capitalizeFirst, isDigit} from "../util/util";
import {getInterval, makeInterval, makeScale, scaleDefinitions, simplifyIfAugmentedIntervals} from "../util/intervals";
import MIDISounds from 'midi-sounds-react';
import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import ScoreRow from "./ScoreRow";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import { useParams } from "react-router-dom";
import { useHotkeys } from 'react-hotkeys-hook';
import Sound from 'react-sound';
import correctSound from "../sounds/varia/correct.mp3"
import wrongSound from "../sounds/varia/wrong.mp3"
import * as notes from "../util/notes";

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
    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
    const [soundFile, setSoundFile] = useState("");
    const [answer, setAnswer] = useState(null); // <- maybe not necessary.. in format: {degrees:[], shortName: interval.shortName}
    const [answered, setAnswered] = useState(false);
    const [intervalData, setIntervalData] = useState({degrees:[], notes:[], interval: null}); // {degrees: []}
    const [degreesEnteredByUser, setDegreesEnteredByUser] = useState("");
    const [voiceFeedback, setVoiceFeedback] = useState(false); // for visibly impaired support


    // TODO: for blind support -  result with voice in setAnswer
    // keyboard shortcuts
    // TODO: support for other languages
    // setAnswer is wrong here, rewrite!!
    useHotkeys('v+2', () => setAnswer("v2"), [exerciseHasBegun, interval, intervalButtonsClicked]); // letter's case does not matter
    useHotkeys('s+2', () => setAnswer("s2"), [exerciseHasBegun, interval, intervalButtonsClicked]);
    useHotkeys('v+3', () => setAnswer("v3"), [exerciseHasBegun, interval, intervalButtonsClicked]);
    useHotkeys('s+3', () => setAnswer("s3"), [exerciseHasBegun, interval,intervalButtonsClicked]);
    useHotkeys('p+4', () => setAnswer("p4"), [exerciseHasBegun, interval, intervalButtonsClicked]);
    //useHotkeys('<+4', () => setAnswer("<4"), [exerciseHasBegun, interval]);
    useHotkeys('d+5', () => setAnswer(">5"), [exerciseHasBegun, interval, intervalButtonsClicked]); // NB! d+5 (diminshed
    useHotkeys('p+5', () => setAnswer("p5"), [exerciseHasBegun, interval, intervalButtonsClicked]);
    useHotkeys('v+6', () => setAnswer("v6"), [exerciseHasBegun, interval, intervalButtonsClicked]);
    useHotkeys('s+6', () => setAnswer("s6"), [exerciseHasBegun, interval, intervalButtonsClicked]);
    useHotkeys('v+7', () => setAnswer("v7"), [exerciseHasBegun, interval, intervalButtonsClicked]);
    useHotkeys('s+7', () => setAnswer("s7"), [exerciseHasBegun, interval, intervalButtonsClicked]);
    useHotkeys('p+8', () => setAnswer("p8"), [exerciseHasBegun, interval, intervalButtonsClicked]);

    useHotkeys('shift+left', () => {console.log("Back"); /* how to call goBack() from GoBackMnu Button? */}, [exerciseHasBegun, interval]); // call somehow GoBackBtn onClick function
    useHotkeys('shift+right', () => {
        console.log("Next", exerciseHasBegun);
        if (exerciseHasBegun) {
            renew(isMajor, selectedTonicNote);
        }
    }, [, exerciseHasBegun, interval, isMajor, selectedTonicNote]);
    useHotkeys('shift+up', () => {console.log("Change key/Start exercise"); startExercise() }, [exerciseHasBegun, interval]);
    useHotkeys('shift+down', () => {  // repeat
        if (exerciseHasBegun) {
            playInterval(interval);
        }
        }, [exerciseHasBegun, interval]);

    useHotkeys('shift+ctrl+2', () => console.log("CTRL+2"));
    // probleem on, et kui siit kutsuda setAnswer, siis exerciseHasBegun on tema jaoks alati false
    useHotkeys('shift+ctrl+3', () => { console.log("Trying s3"); setAnswer("s3"); }, [exerciseHasBegun]);

    const possibleTonicVtNotes = ["C/4", "D/4",  "E@/4", "E/4", "F/4",
        "G/4", "A/4", "B@/4", "C/5" ];

    const startExercise = () => {
        setExerciseHasBegun(true);

        const isMajor = getRandomBoolean();

        // ? seprate function for setting the key?
        const changeKey = selectedTonicNote !== null;
        let newSelectedTonicNote = getTonicNote();  //getRandomElementFromArray(tonicNotes);	// Select random note from tonic notes

        while (changeKey && newSelectedTonicNote === selectedTonicNote) {
            newSelectedTonicNote = getTonicNote(); //getRandomElementFromArray(tonicNotes);
        }
        setSelectedTonicNote(newSelectedTonicNote); // is it right place to do it?

        midiSounds.current.setMasterVolume(0.4); // not too loud TODO: add control slider

        //new:
        renew(isMajor,newSelectedTonicNote);
    };


    const getTonicNote = () => { // returns note object by random element in possible
        const tonicNote = getNoteByVtNote(getRandomElementFromArray(possibleTonicVtNotes));
        console.log("New tonic note is: ", tonicNote.vtNote );
        return tonicNote;
    }

    const renew = (isMajor, tonicNote) => {

        // test -  something wrong in testInterval -  v6 gives >5 sometimes..
        const note1 = getNoteByVtNote("B/3");
        const note2 = getNoteByVtNote("F/4");
        const interval = getInterval(note1, note2);
        console.log("getInterval test: ", note1.vtNote, note2.vtNote, interval.interval.shortName);

        // if between triad notes:
        //if (exerciseName === "XXX") {}
        setIsMajor(isMajor);
        setIntervalButtonsClicked([]); // reset clicked buttons
        setGreenIntervalButton(null);

        let possibleDegrees = [];

        if (exerciseName==="tonicTriad") {
            possibleDegrees = [1,3,5,8];
        } else if (exerciseName==="tonicAllScaleDegrees") {
            possibleDegrees = [2,3,4,5,6,7,8]; // siin peaks olema, et esimene noot on alati toonika
        } else if (exerciseName==="allScaleDegrees") {
            possibleDegrees = [1,2,3,4,5,6,7,8];
        } else {

        }


        // TODO: v6 asemel vahel millegipärast <5 ib õige???
        const intervalData = getIntervalFromScale(isMajor ? "major" : "minor", tonicNote.vtNote, possibleDegrees );
        //console.log("renew got: ", intervalData.degrees, intervalData.notes, intervalData.interval.shortName);
        setIntervalData(intervalData);
        setAnswered(false);
        setDegreesEnteredByUser("");
        play(intervalData.notes[0].midiNote, intervalData.notes[1].midiNote);


    }

    const play = (midiNote1, midiNote2) => {
        // melodic
        const duration = 1; //TODO: change
        console.log("Midinotes: ", midiNote1, midiNote2);
        playNote(midiNote1, 0, duration);
        playNote(midiNote2, duration, duration);

        playNote(midiNote1, 3*duration, duration*2);
        playNote(midiNote2, 3*duration, duration*2);
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
        const note1 = getNoteByVtNote(scaleNotes[degree1-1]); // index in the array is degree-1
        const note2 = getNoteByVtNote(scaleNotes[degree2-1]);
        const intervalData = getInterval(note1, note2);
        console.log("getIntervalFromScale: Degrees, interval: ", degree1, degree2, note1.vtNote, note2.vtNote, intervalData.interval.shortName);
        return { degrees:[degree1, degree2], notes: [note1, note2], interval: intervalData.interval }
    };



    const playTonicTriad = (rootMidiNote, isMajor, duration) => {
        const third =  rootMidiNote + ((isMajor) ? 4 : 3);
        const fifth = rootMidiNote + 7;
        // playing melodically (or rather as slow arpeggio)
        const timeInterval = 0.15;
        playNote(rootMidiNote, 0, duration);
        playNote(third, timeInterval, duration - timeInterval);
        playNote(fifth, timeInterval*2, duration - 2*timeInterval);
        console.log("Tonic notes: ", rootMidiNote, third, fifth);
    }

    const playInterval = (interval, isHarmonic=false) => {

        //setTimeout(() => {
            if (isHarmonic) {
                playNote(interval.note1.midiNote, 0, 2);
                playNote(interval.note2.midiNote, 0, 2);
            } else {
                playNote(interval.note1.midiNote, 0, 1);
                playNote(interval.note2.midiNote, 1, 1); // start sekundites
            }
        //}, 300);    // Short user-friendly delay before start
    };



    const playNote = (midiNote, start, duration) => { // start peaks olema sekundites
        midiSounds.current.playChordAt (midiSounds.current.contextTime()+start, 3, [midiNote], duration); // millegipärast ei tööta, kui korrata intervalli
    };


    const checkInterval= (intervalShortName) =>  {
        let correct = true;
        if (intervalData.interval) {
            if (intervalData.interval.shortName !== intervalShortName) {
                correct = false;
                console.log("Vale intervall, õige peaks olema: ", intervalData.interval.shortName)
            } else {
                console.log("Intervall õige ", intervalShortName);
            }
        } else correct = false;
        return correct;
    }

    const checkDegrees = () => {
        const degrees = degreesEnteredByUser.split(" ");
        console.log("Degrees to check: ", degrees);
        let correct = true;
        if (intervalData.degrees) {
             for (let i=0; i<intervalData.degrees.length; i++) {
                 if (parseInt(degrees[i]) !== intervalData.degrees[i]) {
                     console.log("Wrong degree, correct should be: ", degrees[i], intervalData.degrees[i]  );
                     correct = false;
                 } else {
                     console.log("Degree is correct!", degrees[i] );
                 }
             }
        } else correct = false;
        return correct;
    }

    //TODO: Luba siiski ainult ühe korra vastata, mitte proovida ja uuesti. // siis vaja öelda ka õige intervall
    const checkResponse = (response) => { // võibolla peaks olema objektina {shortName="", degrees=[]}, mida saab mitme intervalli puhul siis laiendada

        if (answered) {
            alert(t("alreadyAnswered"));
            return;
        }

        if (exerciseHasBegun) {
            // const correctInterval = getIntervalTranslation(interval.interval.longName);
            setIntervalButtonsClicked(intervalButtonsClicked.concat([response.shortName]));
            const intervalShortName = response.shortName;
            let correct = true, feedBack="";

            if (response.hasOwnProperty("shortName")) {
                correct = correct && checkInterval(response.shortName);
                if (checkInterval(response.shortName)) {
                    feedBack += `${capitalizeFirst(t("interval"))} ${t("correct")}. `;
                    correct = true;
                } else {
                    feedBack += `${capitalizeFirst(t("interval"))}: ${intervalData.interval.shortName} `;
                    correct = false;
                }
            }

            if (degreesEnteredByUser) {
                const degreesCorrect = checkDegrees(response.degrees);
                correct = correct && degreesCorrect;
                if (degreesCorrect) {
                    feedBack += `${capitalizeFirst(t("degrees"))} - ${t("correct")}. `;
                    correct = correct && true;
                } else {
                    feedBack += `${capitalizeFirst(t("degrees"))}: ${intervalData.degrees.join(" ")}`;
                    correct = false;
                }
            }


            if ( correct ) {
                dispatch(setPositiveMessage(feedBack, 5000));
                renew(isMajor, selectedTonicNote);

                colorCorrectAnswerGreen(intervalShortName);
                setIntervalButtonsClicked([]);
                dispatch(incrementCorrectAnswers());


                // maybe it is better to move the sound part to ScoreRow component
                if (voiceFeedback) {
                    setSoundFile(correctSound);
                    setPlayStatus(Sound.status.PLAYING);
                }
            } else {
                dispatch(setNegativeMessage(feedBack, 5000));
                dispatch(incrementIncorrectAnswers());
                if (voiceFeedback) {
                    setSoundFile(wrongSound);
                    setPlayStatus(Sound.status.PLAYING);
                }
            }
        }
    };

    const colorCorrectAnswerGreen = (interval) => {
        setGreenIntervalButton(interval);
        setTimeout(() => {  // Set button color grey after some time
            setGreenIntervalButton(null);
        }, 2000);
    };

    const createButtons = () => {
        let buttons = [];

        const startExerciseButton = <Button key={"startExercise"} color={"green"} onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>;
        const changeKeyButton = <Button key={"changeKey"} primary onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("changeKey")}</Button>;
        const playNextIntervalButton = <Button key={"playNext"} color={"olive"} onClick={() => renew(isMajor, selectedTonicNote)} className={"fullWidth marginTopSmall"}>{t("playNext")}</Button>;
        const repeatIntervalButton = <Button key={"repeat"} color={"green"} onClick={() => play(intervalData.notes[0].midiNote, intervalData.notes[1].midiNote)} className={"fullWidth marginTopSmall"}>{t("repeat")}</Button>;
        const playTonicButton = <Button key={"playTonic"} color={"teal"} className={"fullWidth marginTopSmall"} onClick = {()=> playTonicTriad(selectedTonicNote.midiNote, isMajor, 1)}>{capitalizeFirst( t("tonic") )}</Button>
        if (exerciseHasBegun) {
            buttons.push(repeatIntervalButton, playNextIntervalButton, changeKeyButton, playTonicButton);
        } else {
            buttons.push(startExerciseButton);
        }

        buttons.push(<GoBackToMainMenuBtn key={"goBack"}/>);

        return buttons;
    };

    const createDegreeInputBlock = () => {
        return exerciseHasBegun && (
            <Grid.Row>
                <Grid.Column className={"fullWidth"}>
                    { capitalizeFirst( t("enterDegrees") )}
                    <Input
                        className={"marginLeft"}
                        onChange={e => {
                            let input = e.target.value;
                            const index = input.length-1;
                            // if two last symbols are digits, insert a space in between of them
                            if (index>=1) {
                                if (isDigit(input.charAt(index)) && isDigit(input.charAt(index-1))) {
                                    input = input.substr(0, index) + " " + input.substr(index);
                                    console.log("Inserted space: ", input, index, input.substr(0, index));
                                }
                            }
                            setDegreesEnteredByUser(input);
                        } }
                        onKeyPress={ e=> {
                            if (e.key === 'Enter') {
                                checkDegrees();
                            }
                        }
                        }
                        placeholder={'nt: 1 3'}
                        value={degreesEnteredByUser}
                    />
                </Grid.Column>
            </Grid.Row>
        );
    }

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
                <Button color={getButtonColor(interval)} onClick={() => checkResponse({shortName: interval})} className={"exerciseBtn"}>{displayedName}</Button>
            </Grid.Column>
        )
    };

    const createInervalButtons = () => {
        return exerciseHasBegun && (
            <>
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
                    {createIntervalButton(">5", "Trit. (>5/<4)")}
                    {createIntervalButton("s6", "s6")}
                </Grid.Row>
                <Grid.Row className={"exerciseRow"} columns={3}>
                    {createIntervalButton("v7", "v7")}
                    {createIntervalButton("p8", "p8")}
                    {createIntervalButton("s7", "s7")}
                </Grid.Row>
            </>
        );
    }

    return (
        <div>
            {/*Sound for giving feedback on anwers (for visually impaired support)*/}
            <Sound
                url={soundFile}
                loop={false}
                playStatus={playStatus}
                onFinishedPlaying={ () => setSoundFile("") }
            />
            <Header size='large'>{`${t("setInterval")} ${t(exerciseName)}`}</Header>
            <Grid>
                <ScoreRow showRadioButtons={false}/>
                <Grid.Row>
                    <Grid.Column></Grid.Column>
                    <Grid.Column className={"marginRight"}  floated='right' > {/*Võiks olla joondatud nuppude parema servaga */}
                        <Popup on='click' position='bottom right' trigger={<Button content='?'/>}>
                            <h3>Klahvikombinatsioonid</h3>
                            <p>Intervallid: v+2, s+2, jne (täht enne, siis number, hoida samaaegselt). </p>
                            <p>NB! Tritoon (vähendatud kvint) - d+5 (diminished)</p>
                            <p>Mängi järgmine: shift+paremale</p>
                            <p>Korda: shift+alla</p>
                            <p>Alusta harjutust/Muuda helistikku: shift+üles</p>
                            <p>Tagasi peamenüüsse - veel pole</p>
                        </Popup>
                    </Grid.Column>
                </Grid.Row>
                {createDegreeInputBlock()}
                {createInervalButtons()}
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