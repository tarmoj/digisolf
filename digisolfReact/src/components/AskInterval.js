import React, {useState, useRef, useEffect} from 'react';
import {Button, Divider, Grid, Header, Icon, Input, Popup, Radio, Transition} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setComponent} from "../actions/component";
import MainMenu from "./MainMenu";
import {getNoteByVtNote} from "../util/notes";
import {getRandomElementFromArray, getRandomBoolean, capitalizeFirst, isDigit, getRandomInt} from "../util/util";
import {
    chordDefinitions,
    getInterval, getIntervalBySemitones,
    getIntervalByShortName,
    makeInterval,
    makeScale,
    scaleDefinitions,
    simplifyIfAugmentedIntervals
} from "../util/intervals";
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
    const { exerciseName, parameters } = useParams();


    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    //const isHarmonic = useSelector(state => state.exerciseReducer.isHarmonic);
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
    //const [answer, setAnswer] = useState(null); // <- maybe not necessary.. in format: {degrees:[], shortName: interval.shortName}
    const [answered, setAnswered] = useState(false);
    const [intervalData, setIntervalData] = useState([{degrees:[], notes:[], interval: null}]); //array of: {degrees: []}
    const [degreesEnteredByUser, setDegreesEnteredByUser] = useState("");
    const [voiceFeedback, setVoiceFeedback] = useState(false); // for visibly impaired support
    const [possibleIntervalShortNames, setPossibleIntervalShortNames] = useState([]);
    const [currentResponseIndex, setCurrentResponseIndex] = useState(0); // in case there are several intervals

    const intervalCount = isDigit(parameters) ? parseInt(parameters) : 1;

    // TODO: for blind support -  result with voice in setAnswer
    // keyboard shortcuts
    // TODO: support for other languages
    useHotkeys('v+2', () => checkResponse("v2"), [exerciseHasBegun, intervalData, intervalButtonsClicked]); // letter's case does not matter
    useHotkeys('s+2', () => checkResponse("s2"), [exerciseHasBegun, intervalData, intervalButtonsClicked]);
    useHotkeys('v+3', () => checkResponse("v3"), [exerciseHasBegun, intervalData, intervalButtonsClicked]);
    useHotkeys('s+3', () => checkResponse("s3"), [exerciseHasBegun, intervalData,intervalButtonsClicked]);
    useHotkeys('p+4', () => checkResponse("p4"), [exerciseHasBegun, intervalData, intervalButtonsClicked]);
    //useHotkeys('<+4', () => checkResponse("<4"), [exerciseHasBegun, interval]);
    useHotkeys('d+5', () => checkResponse(">5"), [exerciseHasBegun, intervalData, intervalButtonsClicked]); // NB! d+5 (diminshed
    useHotkeys('p+5', () => checkResponse("p5"), [exerciseHasBegun, intervalData, intervalButtonsClicked]);
    useHotkeys('v+6', () => checkResponse("v6"), [exerciseHasBegun, intervalData, intervalButtonsClicked]);
    useHotkeys('s+6', () => checkResponse("s6"), [exerciseHasBegun, intervalData, intervalButtonsClicked]);
    useHotkeys('v+7', () => checkResponse("v7"), [exerciseHasBegun, intervalData, intervalButtonsClicked]);
    useHotkeys('s+7', () => checkResponse("s7"), [exerciseHasBegun, intervalData, intervalButtonsClicked]);
    useHotkeys('p+8', () => checkResponse("p8"), [exerciseHasBegun, intervalData, intervalButtonsClicked]);

    useHotkeys('shift+left', () => {console.log("Back"); /* how to call goBack() from GoBackMnu Button? */}, [exerciseHasBegun, interval]); // call somehow GoBackBtn onClick function
    useHotkeys('shift+right', () => {
        console.log("Next", exerciseHasBegun);
        if (exerciseHasBegun) {
            renew();
        }
    }, [, exerciseHasBegun, intervalData, isMajor, selectedTonicNote]);
    useHotkeys('shift+up', () => {console.log("Change key/Start exercise"); startExercise() }, [exerciseHasBegun, interval]);
    useHotkeys('shift+down', () => {  // repeat
        if (exerciseHasBegun) {
            // we need new play
            play(intervalData)
        }
        }, [exerciseHasBegun, interval]);

    //useHotkeys('shift+ctrl+2', () => console.log("CTRL+2"));
    // probleem on, et kui siit kutsuda checkResponse, siis exerciseHasBegun on tema jaoks alati false
    //useHotkeys('shift+ctrl+3', () => { console.log("Trying s3"); setAnswer("s3"); }, [exerciseHasBegun]);

    const possibleTonicVtNotes = ["C/4", "D/4",  "E@/4", "E/4", "F/4",
        "G/4", "A/4", "B@/4", "C/5" ];

    const startExercise = () => {
        setExerciseHasBegun(true);
        midiSounds.current.setMasterVolume(0.4); // not too loud TODO: add control slider

        if (exerciseName === "randomInterval") { //        // if interval from note, set possible parameters:
            let possibleIntervalShortNames = [];
            if (parameters.includes(".")) { // allow giving the interval names (via shortName) as name via URL like /M.m.M6.m6
                console.log("Extract possible intervals from name: ");
                // filter out elements that now interval can be found with
                possibleIntervalShortNames = parameters.toString().split(".").filter( shortName => getIntervalByShortName(shortName) );
                console.log(possibleIntervalShortNames);
            } else {
                possibleIntervalShortNames = ["v2", "s2", "v3", "s3", "p4", ">5", "p5", "v6", "s6", "v7", "s7", "p8"];
            }
            setPossibleIntervalShortNames(possibleIntervalShortNames);
            //TODO: later display selection with checkboxes - see AskChord
            renewRandom(possibleIntervalShortNames);

        } else { // intervals in key
            changeKey(); // calls also renewInKey()
        }



    };



    const changeKey = () => {
        let tonicNote = selectedTonicNote; // to select different  from previous
        const isMajor = getRandomBoolean(); // TODO: later major|natMinor|harmMinor can be set from parameters

        while (tonicNote === selectedTonicNote) {
            tonicNote = getNoteByVtNote(getRandomElementFromArray(possibleTonicVtNotes));
        }
        console.log("isMajor, new tonic note is: ", isMajor, tonicNote.vtNote );

        setSelectedTonicNote(tonicNote);
        setIsMajor(isMajor);
        // also play tonic
        const triadDuration = 1.5;
        playTonicTriad(tonicNote.midiNote, isMajor, triadDuration);

        setTimeout( ()=>renewInKey(isMajor, tonicNote), triadDuration*1000 + 300 ) ; // new exercise after the chord

    }

    const renew = () => {
        setIntervalButtonsClicked([]); // reset clicked buttons
        setGreenIntervalButton(null);
        setAnswered(false);
        midiSounds.current.cancelQueue();

        if (exerciseName.includes("random")) {
            renewRandom(possibleIntervalShortNames);
        } else {
            renewInKey(isMajor, selectedTonicNote);
;        }




    }
    const renewInKey = (isMajor, tonicNote) => {

        let possibleDegrees = [];

        if (exerciseName==="tonicTriad") {
            possibleDegrees = [1,3,5,8];
        } else if (exerciseName==="tonicAllScaleDegrees") {
            possibleDegrees = [2,3,4,5,6,7,8]; // siin peaks olema, et esimene noot on alati toonika
        } else if (exerciseName==="allScaleDegrees") {
            possibleDegrees = [1,2,3,4,5,6,7,8];
        } else {

        }

        // let's have intervalData as array of objects

        const intervalData = [];

        for (let i=0; i<intervalCount;i++ ) {
            //TODO : check that second data is not the same as first JSON.stingify === ?
            const data = getIntervalFromScale(isMajor ? "major" : "minor", tonicNote.vtNote, possibleDegrees );
            intervalData.push(data);
        }
        console.log("renew got: ", intervalData);
        setIntervalData(intervalData);
        setDegreesEnteredByUser("");
        play(intervalData);
    }

    const renewRandom = (possibleShortNames) => {
        const intervalData = [];
        for (let i=0; i<intervalCount;i++ ) {
            //TODO : check that second data is not the same as first JSON.stingify === ?
            const data = getRandomInterval(possibleShortNames);
            intervalData.push(data);
        }
        setIntervalData(intervalData);
        play(intervalData);

    }


    const play = (intervalData) => { // intervalData may contain several intervals
        // melodic
        const intervalCount = intervalData.length;

        const noteDuration = intervalCount>1 ? 0.5 : 1 ;
        const chordDuration = 2*noteDuration;
        const pause = 1;
        let start = 0;
        // kui mitu, siis vaja esitada meloodiliselt kaheksandikes (pausid vahel) VÕI harmooniliselt
        if (intervalCount===1) {
            const midiNote1 = intervalData[0].notes[0].midiNote;
            const midiNote2 = intervalData[0].notes[1].midiNote;
            playNote(midiNote1, start, noteDuration); // melodic - one after another
            playNote(midiNote2, start + noteDuration, noteDuration);
            start += noteDuration * 2 + pause;

            playNote(midiNote1, start, chordDuration); // harmonic - together
            playNote(midiNote2, start, chordDuration);

        } else if (intervalCount>1) {

            for (let data of intervalData) { // first melodic
                const midiNote1 = data.notes[0].midiNote;
                const midiNote2 = data.notes[1].midiNote;
                console.log("Midinotes: ", midiNote1, midiNote2);
                playNote(midiNote1, start, noteDuration); // melodic - one after another
                playNote(midiNote2, start + noteDuration, noteDuration);

                start += noteDuration*2 + pause;
            }

            for (let data of intervalData) {  // then harmonic (together)
                const midiNote1 = data.notes[0].midiNote;
                const midiNote2 = data.notes[1].midiNote;
                playNote(midiNote1, start, chordDuration); // melodic - one after another
                playNote(midiNote2, start, chordDuration);

                start += chordDuration + pause;
            }
        }

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

        // TODO: avoid getting same result twice


        const intervalInfo = getInterval(note1, note2);
        console.log("getIntervalFromScale: Degrees, interval: ", degree1, degree2, note1.vtNote, note2.vtNote, intervalInfo.interval.shortName);
        return { degrees:[degree1, degree2], notes: [note1, note2], interval: intervalInfo.interval }
    };

    const getRandomInterval = (possibleShortNames, index=0) => { // index -  to check which interval we are renewing, if there are several asked

        let interval = intervalData[index].interval; // not sure if it makes sense...
        while (interval === intervalData[index].interval) {
            interval = getIntervalByShortName(getRandomElementFromArray(possibleShortNames));
            if (!interval) {
                console.log("Failed finding interval");
                return;
            }
        }

        const up = getRandomBoolean(); // direction
        let midiNote1, midiNote2;
        midiNote1 = up ? getRandomInt(60, 80-interval.semitones)  : getRandomInt(60+interval.semitones, 80);
        midiNote2 = up ? midiNote1 + interval.semitones : midiNote1 - interval.semitones;
        console.log("getRandomInterval interval, midinote1, midinote2", interval.shortName, midiNote1, midiNote2);

        const data = {interval: interval, notes: [{midiNote:midiNote1}, {midiNote:midiNote2} ]}; // no notenames needed here so far
        return data;

    }



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

    // const playInterval = (interval, isHarmonic=false) => {
    //         if (isHarmonic) {
    //             playNote(interval.note1.midiNote, 0, 2);
    //             playNote(interval.note2.midiNote, 0, 2);
    //         } else {
    //             playNote(interval.note1.midiNote, 0, 1);
    //             playNote(interval.note2.midiNote, 1, 1); // start sekundites
    //         }
    // };



    const playNote = (midiNote, start, duration) => { // start peaks olema sekundites
        midiSounds.current.playChordAt (midiSounds.current.contextTime()+start, 3, [midiNote], duration); // millegipärast ei tööta, kui korrata intervalli
    };


    const checkInterval= (intervalShortName, index=0) =>  {
        let correct = true;
        if (intervalData[index].interval) {
            if (intervalData[index].interval.shortName !== intervalShortName) {
                correct = false;
                console.log("Vale intervall, õige peaks olema: ", intervalData[index].interval.shortName)
            } else {
                console.log("Intervall õige ", intervalShortName);
            }
        } else correct = false;
        return correct;
    }

    const checkDegrees = (index=0) => {
        const degrees = degreesEnteredByUser.split(" ");
        console.log("Degrees to check: ", degrees);
        let correct = true;
        if (intervalData[index].degrees) {
             for (let i=0; i<intervalData[index].degrees.length; i++) {
                 if (parseInt(degrees[i]) !== intervalData[index].degrees[i]) {
                     console.log("Wrong degree, correct should be: ", degrees[i], intervalData[index].degrees[i]  );
                     correct = false;
                 } else {
                     console.log("Degree is correct!", degrees[i] );
                 }
             }
        } else correct = false;
        return correct;
    }

    //TODO: Luba siiski ainult ühe korra vastata, mitte proovida ja uuesti. // siis vaja öelda ka õige intervall
    const checkResponse = (shortName) => { // võibolla peaks olema objektina {shortName="", degrees=[]}, mida saab mitme intervalli puhul siis laiendada

        if (answered) {
            alert(t("alreadyAnswered"));
            return;
        }

        setAnswered(true);

        if (exerciseHasBegun) {
            // const correctInterval = getIntervalTranslation(interval.interval.longName);
            setIntervalButtonsClicked(intervalButtonsClicked.concat([shortName]));
            const intervalShortName = shortName;
            let correct = true, feedBack="";

            if (shortName) {
                const intervalCorrect = checkInterval(shortName);
                correct = correct && intervalCorrect;
                if (intervalCorrect) {
                    feedBack += `${capitalizeFirst(t("interval"))} ${t("correct")}. `;
                    correct = true;
                } else {
                    feedBack += `${capitalizeFirst(t("interval"))}: ${intervalData[currentResponseIndex].interval.shortName} `;
                    correct = false;
                }
            }

            if (degreesEnteredByUser) {
                const degreesCorrect = checkDegrees();
                correct = correct && degreesCorrect;
                if (degreesCorrect) {
                    feedBack += `${capitalizeFirst(t("degrees"))} - ${t("correct")}. `;
                    correct = correct && true;
                } else {
                    feedBack += `${capitalizeFirst(t("degrees"))}: ${intervalData[currentResponseIndex].degrees.join(" ")}`;
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
        const startExerciseButton = <Button key={"startExercise"} color={"green"} onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>;
        const changeKeyButton = exerciseName.includes("random")  ? null :
            <Button key={"changeKey"} primary onClick={changeKey} className={"fullWidth marginTopSmall"}>{t("changeKey")}</Button>;
        const playNextIntervalButton = <Button key={"playNext"} color={"olive"} onClick={() => renew()} className={"fullWidth marginTopSmall"}>{t("playNext")}</Button>;
        const repeatIntervalButton = <Button key={"repeat"} color={"green"} onClick={() => play(intervalData)} className={"fullWidth marginTopSmall"}>{t("repeat")}</Button>;
        const playTonicButton = exerciseName.includes("random")  ? null :
            <Button key={"playTonic"} color={"teal"} className={"fullWidth marginTopSmall"} onClick = {()=> playTonicTriad(selectedTonicNote.midiNote, isMajor, 1)}>{capitalizeFirst( t("tonic") )}</Button>
        if (exerciseHasBegun) {
            return (
                <>
                    <Grid.Row className={"exerciseRow"} columns={2}>
                        <Grid.Column>{playNextIntervalButton}</Grid.Column>
                        <Grid.Column>{repeatIntervalButton}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={"exerciseRow"} columns={2}>
                        <Grid.Column>{playTonicButton}</Grid.Column>
                        <Grid.Column>{changeKeyButton}</Grid.Column>
                    </Grid.Row>
                </>
            )
        } else {
            return (<Grid.Row><Grid.Column> {startExerciseButton}</Grid.Column></Grid.Row>);
        }

        //buttons.push(<GoBackToMainMenuBtn key={"goBack"}/>);

        //return buttons;
    };

    const createDegreeInputBlock = () => {
        return exerciseHasBegun && !exerciseName.includes("random") && (
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
                <Button color={getButtonColor(interval)} onClick={() => checkResponse(interval)} className={"exerciseBtn"}>{displayedName}</Button>
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
                {createButtons()}
                <Grid.Row>
                    <Grid.Column>
                        <GoBackToMainMenuBtn/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <MIDISounds ref={midiSounds} appElementName="root" instruments={[3]} />
        </div>
    );
};

export default AskInterval