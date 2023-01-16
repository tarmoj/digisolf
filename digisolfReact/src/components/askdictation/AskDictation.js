import React, {useState, useEffect} from 'react';
import {Input} from 'semantic-ui-react';
import {Button, Grid} from '@material-ui/core'; // start porting to material ui
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {arraysAreEqual, capitalizeFirst, deepClone, isDigit, simplify, weightedRandom} from "../../util/util";
import {parseLilypondDictation} from "../../util/notes";
import ScoreRow from "../ScoreRow";
import Notation from "../notation/Notation";
import GoBackToMainMenuBtn from "../GoBackToMainMenuBtn";
import Sound from 'react-sound';
import Select from "semantic-ui-react/dist/commonjs/addons/Select";
import {useParams} from "react-router-dom";
import {dictations as oneVoice} from "../../dictations/1voice";
import {dictations as twoVoice} from "../../dictations/2voice";
import {dictations as popJazz} from "../../dictations/popJazz";
import {dictations as degrees} from "../../dictations/degrees";
import {dictations as classical} from "../../dictations/classical"
import {resetState, setAllowInput, setInputNotation} from "../../actions/askDictation";
import {notationInfoToVtString} from "../notation/notationUtils";
import Volume from "../Volume";
// import {MenuItem} from "@material-ui/core";




const AskDictation = () => {
    const { name, title } = useParams(); // title is optional, used for opening the dictation by url

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const defaultNotationInfo = {  clef:"treble", time: "4/4", vtNotes: "" };

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [selectedDictation, setSelectedDictation] = useState({title:"", soundFile:"", notation:""});
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [showCorrectNotation, setShowCorrectNotation] =  useState(false);

    const [lyUserInput, setLyUserInput] = useState("");
    const [lyUserInput2, setLyUserInput2] = useState("");
    //const [degreesEnteredByUser, setDegreesEnteredByUser] = useState("");

    //const [notationInfo, setNotationInfo] = useState(defaultNotationInfo); // do we need it?

    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
    const [wrongNoteIndexes, setWrongNoteIndexes] = useState(null);
    const [volume, setVolume] = useState(0.6);
    const [inputVtString, setInputVtString] = useState( "stave\n");
    const [correctVtString, setCorrectVtString] = useState( "stave\n");
    const [correctNotationWidth, setCorrectNotationWidth] = useState (400);
    const [correctNotation, setCorrectNotation] = useState (defaultNotationInfo);
    const [difficultyLevel, setDifficultyLevel ] = useState("simple"); // simple|medium|difficult


    const VISupportMode = useSelector(state => state.exerciseReducer.VISupportMode);
    const masterVolume = useSelector(state => state.exerciseReducer.volume);

    const instrument = useSelector(state => state.exerciseReducer.instrument);

    useEffect(() => {
        dispatch(resetState());
        document.title = `${ capitalizeFirst( t("dictations") )}`;
    }, []);

    const dictationType = name.toString().split("_")[0]; // categories come in as 1voice_level1 etc

    let dictations = [];
    switch (dictationType) {
        case "1voice": dictations = oneVoice; break;
        case "2voice": dictations = twoVoice; break;
        case "degrees": dictations = degrees; break;
        case "classical": dictations = classical; break;
        case "popJazz": dictations = popJazz; break;
        default: dictations = oneVoice;
    }

    const inputNotation = useSelector(state => state.askDictationReducer.inputNotation);
    const allowInput = useSelector(state => state.askDictationReducer.allowInput);



    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);
        if (title && dictations) {
            //find index of that dictation
            let index = dictations.findIndex( element => {
                if (element.title === title && element.category.startsWith(name)) { // later - element.category === name
                    return true;
                } else {
                    return false;
                }
            });
            //console.log("was able to find index for ", title, index);
            if (index>=0) {
                renew(index);
            }

        }

    };


    const renew = (dictationIndex) => {
        console.log("Renew: ", dictationIndex);
        setAnswered(false);
        setLyUserInput("");
        setLyUserInput2("");
        setShowCorrectNotation(false);
        setWrongNoteIndexes(null);

        let dictation = dictations[dictationIndex];

        let answer = null;

        answer = {notation: selectedDictation.notation}; // <- this will not be used
        const notationInfo = parseLilypondDictation(dictation.notation);
        //console.log("correct notation notes: ", notationInfo);
        //dispatch(setCorrectNotation(notationInfo));
        setCorrectNotation(notationInfo)
        setCorrectVtString( notationInfoToVtString(notationInfo) ); // <- is this necessary  or shall we need correctNotation reducer then at all?
        setCorrectNotationWidth( getWidth(notationInfo)  );
        dispatch(resetState());
        dispatch(setAllowInput(true));
        showFirstNote(dictation);

        setSelectedDictation(dictation);
        setAnswer(answer);

        if (exerciseHasBegun) {
            play(dictation);
        }

    };

    const play = (dictation) => {
        stop(); // need a stop here  - take care, that it does not kill already started event
        //playSoundFile(dictation.soundFile);
        setPlayStatus(Sound.status.PLAYING);
    };

    const stop = () => {
        // console.log("***Stop***");
        setPlayStatus(Sound.status.STOPPED);
    };

    const isLyNote = chunk => ['c','d','e','f','g','a','b','h'].includes(chunk.charAt(0));

    const getLyBeginning = (lyString) => { // return the beginning of dictation in Lilypond until first note
        const chunks = simplify(lyString).split(" ");
        for (let i=1; i<chunks.length-1; i++) {
            //console.log("Chunk, is Lynote: ", chunks[i], isLyNote(chunks[i]) );
            if (isLyNote(chunks[i]) && isLyNote(chunks[i+1])) { // usually in the header there are keywords like \time 4/4 \clef violint \key g \major, if there are two notes in a row, this is most likely first note
                const beginning = chunks.slice(0, i+1).join(" ");
                console.log("ly found first note: ", i, chunks[i]);
                console.log("ly beginning: ", beginning);
                return beginning;
            }
        }
        return "";
    }

    // some dictation may have property show (in lilypond), if not, copy stave definitions and stave's first notes to inputNotation
    const showFirstNote= (dictation) => {
        console.log("Show first note")
        let notationInfo = {};
        if (dictation.hasOwnProperty("show")) {
            notationInfo = parseLilypondDictation(dictation.show);
            dispatch( setInputNotation(notationInfo));
            if (VISupportMode) {
                if (dictation.notation.hasOwnProperty("stave2")) {
                    setLyUserInput(simplify(dictation.show.stave1));
                    setLyUserInput2(simplify(dictation.show.stave2));

                } else {
                    setLyUserInput(dictation.show.trim().replace(/\s\s+/g, ' '));
                }
            }
        } else {
            notationInfo = parseLilypondDictation(dictation.notation);
            if (notationInfo.staves.length>0) {
                for (let stave of notationInfo.staves) {
                    for (let voice of stave.voices) {
                        voice.notes.splice(1); // leave only the first note
                    }
                }
                dispatch( setInputNotation(notationInfo)); // or this arrives Notation one render cycle too late (ie dictation shows the note of previous one
                if (VISupportMode) {
                    if (dictation.notation.hasOwnProperty("stave2")) {
                        const beginning1 = getLyBeginning(dictation.notation.stave1);
                        const beginning2 = getLyBeginning(dictation.notation.stave2);
                        setLyUserInput(beginning1);
                        setLyUserInput2(beginning2);
                    } else {
                        const beginning = getLyBeginning(dictation.notation);
                        setLyUserInput(beginning);

                    }
                }

            } else {
                console.log("No staves in correctNotation");
            }

        }
        // do we need both setVtString and dispatch? - yes, since Notation will be created later and it needs input to show
        if (notationInfo ) {
            setInputVtString(notationInfoToVtString(notationInfo));
        }
    };

    const showDictation = () => {
        if (selectedDictation.notation.length === 0 ) {
            alert( t("chooseDictation"));
            return;
        }

        dispatch(setAllowInput(!allowInput));
        setShowCorrectNotation(!showCorrectNotation);

        // Empty wrong note indexes if "Kontrolli" has been pressed second time
        if (showCorrectNotation) {
            setWrongNoteIndexes(null);
        }
    };

    const checkResponse = (response) => { // response is an object {key: value [, key2: value, ...]}

        if (!exerciseHasBegun) {
            alert(t("pressStartExsercise"));
            return;
        }

        if (selectedDictation.notation.length === 0 ) {
            alert( t("chooseDictation"));
            return;
        }


        let incorrectNotes = [];

        // tarmo: NB! temporary! until two-stave input is not supported. Later take care that  there is two input staves for 2voice dictations
        if (inputNotation.staves.length < correctNotation.staves.length ) {
            console.log("Too few input staves!");
            showDictation();
            return;
        }

        // TODO: now when also duration is checked, barlines are marked in inputNotatios, since if inserted via NotationINput, they have duration, but that should be "0"
        // best is just to ignore
        for (let i = 0, n = correctNotation.staves.length; i < n; i++) {
            for (let j = 0, n = correctNotation.staves[i].voices.length; j < n; j++) {
                /*   started removing barlines from check
                // filter out barlines and other notes with no duration
                const inputNotes =  inputNotation.staves[i].voices[j].notes.filter(note => note.duration != "0");
                const correctNotes =  correctNotation.staves[i].voices[j].notes.filter(note => note.duration != "0");
                console.log("correct notes filtered: ", correctNotes);
                // TODO: problem this way the indexes get wrong, should we use findIndex in inPutnotation to find the right index
                */

                for (let k = 0, n = correctNotation.staves[i].voices[j].notes.length; k < n - 1; k++) { // Skip end barline
                    // ignore barlines
                    if (inputNotation.staves[i].voices[j].notes[k] && !inputNotation.staves[i].voices[j].notes[k].keys[0].includes("|") ) {
                        if (!inputNotation.staves[i].voices[j].notes[k] ||
                            !arraysAreEqual(correctNotation.staves[i].voices[j].notes[k].keys, inputNotation.staves[i].voices[j].notes[k].keys) ||
                            correctNotation.staves[i].voices[j].notes[k].duration !== inputNotation.staves[i].voices[j].notes[k].duration) {
                            incorrectNotes.push({
                                staveIndex: i,
                                voiceIndex: j,
                                noteIndex: k
                            });
                        }
                    }
                }
            }
        }

        setWrongNoteIndexes(incorrectNotes);
        showDictation();

    };


    // UI ======================================================

    const createControlButtons = () => {
        // console.log("Begun: ", exerciseHasBegun);

        if (exerciseHasBegun) {
            return (
                <Grid item container spacing={1} direction={"row"} className={"exerciseRow"}>
                    <Grid item xs={4}>
                        <Button variant="contained" color={"primary"} onClick={() => play(selectedDictation)} className={"fullWidth marginTopSmall"} >
                            { capitalizeFirst( t("play")) }
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained"  onClick={() => stop()} className={"fullWidth marginTopSmall"}  >{ capitalizeFirst( t("stop") )}</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" className={"fullWidth marginTopSmall"}
                                onClick={() => checkResponse(null)}>{capitalizeFirst(t("check"))}
                        </Button>
                    </Grid>
                </Grid>

            );
        } else {
            return(
                <Grid item container>
                        <Button variant="contained" color={"primary"} onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>
                </Grid>
            );
        }
    };

    const handleLilypondInput = () => {
        let notationInfo = null;
        if (selectedDictation.notation.hasOwnProperty("stave2")) { // two voiced dictation
            notationInfo = parseLilypondDictation( { stave1: lyUserInput, stave2: lyUserInput2} );
        } else {
            notationInfo = parseLilypondDictation( lyUserInput );  // one voiced
        }
        dispatch( setInputNotation(notationInfo));
        //setInputVtString(notationInfoToVtString(notationInfo));
    };

    const createLilypondInput = () => {
        return (exerciseHasBegun) ? (
            <>
                <Grid item container>
                    {  capitalizeFirst( t("enterNotationInLilypond") )  }
                </Grid>
                <Grid item container spacing={1} direction={"row"} className={"exerciseRow"}>
                    <Grid item xs={2}>{ capitalizeFirst( t("firstVoice") ) + ": " }</Grid>
                    <Grid xs={8} >
                        <Input
                            className={"fullWidth"}
                            style={{ width: "100%" }}
                            onChange={e => {  setLyUserInput(e.target.value) } }
                            onKeyPress={ e=> {
                                if (e.key === 'Enter') {
                                    handleLilypondInput()
                                }
                            }
                            }
                            placeholder={`nt: \\time 4/4 c' e' g`}
                            value={lyUserInput}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" onClick={handleLilypondInput}>
                            {capitalizeFirst(t("show"))}
                        </Button>
                    </Grid>

                </Grid>
                { selectedDictation.notation.hasOwnProperty("stave2") &&
                <Grid item container spacing={1} direction={"row"} className={"exerciseRow"}>
                    <Grid item xs={3}>
                        {  capitalizeFirst( t("secondVoice") ) + ":" }
                    </Grid>
                    <Grid item xs={8}>
                        <Input
                            className={"marginRight"}
                            style={{ width: "100%" }}
                            onChange={e => {  setLyUserInput2(e.target.value) } }
                            onKeyPress={ e=> {
                                if (e.key === 'Enter') {
                                    handleLilypondInput()
                                }
                            }
                            }
                            placeholder={`nt: \\clef bass \\time 4/4 c' e' g`}
                            value={lyUserInput2}
                        />
                    </Grid>
                    <Grid item xs={1}></Grid>
                </Grid>

                }
                { showCorrectNotation &&
                <>
                    <label className={"marginRight"}>{  capitalizeFirst( t("correct") ) + ": " }</label>
                    {  selectedDictation.notation.hasOwnProperty("stave2") ?
                        (
                            <>
                                <Grid.Row columns={2}>
                                    <Grid.Column width={3}>{ capitalizeFirst( t("firstVoice") )}</Grid.Column>
                                    <Grid.Column width={12}>
                                        <Input value={simplify(selectedDictation.notation.stave1)}  style={{width: "100%"}} />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={2}>
                                    <Grid.Column width={3}>{ capitalizeFirst( t("secondVoice") )}</Grid.Column>
                                    <Grid.Column width={12}>
                                        <Input value={simplify(selectedDictation.notation.stave2)} style={{width: "100%"}} />
                                    </Grid.Column>
                                </Grid.Row>
                            </>
                        ) : (
                            <Grid.Row columns={2}>
                                <Grid.Column width={3} />
                                <Grid.Column width={12}>
                                    <Input  value={simplify(selectedDictation.notation) } style={{width: "100%"}} />
                                </Grid.Column>
                            </Grid.Row>
                        )


                    }
                </>
                }
            </>
        ) : null;

    };

    const createNotationInputBlock =  () => {

        if (exerciseHasBegun && dictationType!=="degrees" && selectedDictation.title !== "") { // allow showing notation also in the beginning, otherwise setting "show" does not work...
            return (
                <Notation  className={"marginTopSmall"}
                           scale={1}
                           vtString={inputVtString}
                           showInput={!VISupportMode}
                           wrongNoteIndexes={wrongNoteIndexes}
                           name={"inputNotation"}
                           width={getWidth(inputNotation)}
                />
            )
        }
    };

    const createCorrectNotationBlock = () => {
        //TODO: kuskil peaks näitama, et alumine õige                     <p className={"marginLeft"}>{capitalizeFirst(t("correct"))}:</p>
        // aga praegu notatsioon vist ühes ühises divi-is ja ma ei tea, kuidas sinna teksti saada.
        if (exerciseHasBegun && selectedDictation.title !== "" && showCorrectNotation) {
            return (
                <>

                    { selectedDictation.hasOwnProperty("credits") &&
                    <Grid.Row className={"marginTopSmall"}>{ capitalizeFirst(t("credits")) }: {selectedDictation.credits}</Grid.Row>
                    }
                    <Notation className={"marginTopSmall center"}
                          scale={1}
                          vtString={correctVtString}
                          showInput={false}
                          name={"correctNotation"}
                          width={correctNotationWidth}
                    />
                </>
            )
        }
    };

    const getWidth = (notation) => {
        let noteCount = 0;
        // find the number of notes on the stave that has the most notes;
        for (let stave of notation.staves) {
            if (stave.voices[0].notes.length>noteCount) {
                noteCount = stave.voices[0].notes.length;
            }
        }
        return  Math.max( noteCount * 30, 400);
    };

    const createSelectionMenu = () => {
        const options = [];
        for (let i=0; i< dictations.length; i++) {
            if ( dictations[i].category.startsWith(name) ) { // NB! no levels for now!, _leve1 etc are ignored
                options.push( { value: i, text: dictations[i].title  } );
            }
        }

        return ( exerciseHasBegun &&
            <Grid container direction={"row"}>
                {/*<Grid.Column computer={"8"} tablet={"8"} mobile={"16"}>*/}
                <Grid item xs={6}>
                  <label className={"marginRight "}>{ capitalizeFirst(t("chooseDictation")) }</label>
                  <Select
                        className={"marginTopSmall fullwidth"}
                        placeholder={t("chooseDictation")}
                        options={options}
                        defaultValue= {title ? title : "" }
                        onChange={(e, {value}) => {
                            renew(value);
                        }
                        }
                    />
                </Grid>
            </Grid>
        );
    } ;

    const handleDictationFinishedPlaying = () => {
        setPlayStatus(Sound.status.STOPPED);
    };

    return (
        <div>
            <h2 size='large'>{`${capitalizeFirst( t(name) )} ${selectedDictation.title} `}</h2>
            <h3><i>NB! See moodul läheb ümberkirjutamisele ja mitmed notatsiooniprobleemid lahenevad.</i></h3>

            <Sound
                url={process.env.PUBLIC_URL + selectedDictation.soundFile}
                volume={masterVolume*100}
                loop={false}
                playStatus={playStatus}
                onFinishedPlaying={handleDictationFinishedPlaying}
            />

            <Grid container direction={"column"} spacing={1}>
                <ScoreRow/>
                {createSelectionMenu()}
                {VISupportMode && createLilypondInput() }
                { createNotationInputBlock() }
                {createCorrectNotationBlock()}

                { exerciseHasBegun &&  <Grid item xs={4}> <Volume /> </Grid>  }
                {createControlButtons()}
                <Grid item container>
                        <GoBackToMainMenuBtn/>
                </Grid>
            </Grid>

        </div>

    );
};

export default AskDictation;