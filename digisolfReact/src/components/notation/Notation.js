import React, {useEffect, useRef, useState} from 'react';
import {Flow} from 'vextab/releases/vextab-div';
import NotationInput from "./NotationInput";
import {vtNames, notationInfoToVtString} from "./notationUtils";
import {useSelector, useDispatch} from "react-redux";
import {setSelectedNote} from "../../actions/askDictation";
import {artist, vexTab, scale, createVexTabString} from "./vextabUtils";

const Notation = (props) => {

    const vtDiv = useRef(null);
    const [renderer, setRenderer] = useState(null);
    const inputNotation = useSelector(state => state.askDictationReducer.inputNotation);
    const selectedNote = useSelector(state => state.askDictationReducer.selectedNote);
    const selectedNoteSet = useSelector(state => state.askDictationReducer.selectedNoteSet);
    const dispatch = useDispatch();

    useEffect(() => {
        initializeVexTab();
    }, []); 

    useEffect(() => {
<<<<<<< HEAD
        if (inputNotation) {
            redraw(notationInfoToVtString(inputNotation));
        }
    }, [inputNotation]);
=======
        console.log("First run", props.name);
        vexTabInit();
    }, []); // [] teise parameetrina tähendab, et kutsu välja ainult 1 kord
>>>>>>> 575cae55753935561640636dc7b7198ca3264217

    useEffect(() => {
        if (selectedNoteSet) {
            const note = artist.staves[0].note_notes[selectedNote.index];
            highlightSelectedNote(note);
        }
<<<<<<< HEAD
    }, [selectedNote]);
=======
        console.log("props.notes change ", props.notes , props.name );
    }, [props]);
>>>>>>> 575cae55753935561640636dc7b7198ca3264217

    useEffect(() => {
        console.log("wrong notes in effect  ", props.wrongNoteIndexes, props.name)
        if (props.wrongNoteIndexes) {
            markWrongNotes();
        }
    }, [props.wrongNoteIndexes]);


    useEffect(() => {
        if (renderer !== null) {
            renderer.getContext().svg.onclick = (event) => handleClick(event);
            redraw("");
        }
    }, [renderer]);

    useEffect(() => {
<<<<<<< HEAD
        if (props.notes) {
            redraw(props.notes);
        }
    }, [props]);

    const initializeVexTab = () => {
        console.log("**** Initializing VexTab ****");
=======
        refreshNote();
    }, [octave]);



    // TODO 22.11.2020: think this over. has to target a specific note, not just the last one
    // Tarmo: insertNote have parameters index, voice, stave to select the note
    // probably we need currentNoteIndex, currentVoice, currentstave to use with addNote and removeNote
    const refreshNote = () => {
        removeNote();
        addNote();
    }

    // the 2 objects below are mainly used for passing values to NotationTable
    const selected = {
        note: note,
        accidental: accidental,
        duration: duration,
        dot: dot,
        octave: octave
    }

    const setters = {
        setNote: setNote, 
        setDuration: setDuration, 
        setAccidental: setAccidental,
        setDot: setDot,
        setOctave: setOctave
    };

    const vexTabInit = () => {
        console.log("**** VexTab INIT ****", props.name);
>>>>>>> 575cae55753935561640636dc7b7198ca3264217
        const renderer = new Flow.Renderer(vtDiv.current, Flow.Renderer.Backends.SVG);
        setRenderer(renderer);
    };

    const handleClick = (event) => {
        const x = event.layerX / scale;
        const closestIndex = findClosestNoteByX(x);

        if (closestIndex>=0) {
            const note = artist.staves[0].note_notes[closestIndex];
            setCurrentNote(closestIndex, note);
            redraw(notationInfoToVtString(inputNotation));
            highlightSelectedNote(note);
        }
    };

    const highlightSelectedNote = (note) => {
        if (note) {
            renderer.getContext().rect(note.getAbsoluteX()-10, note.stave.getYForTopText()-10, note.width+20, note.stave.height+10,
            { fill: "lightblue", opacity:"0.2" } );
        }
    }

    const findClosestNoteByX = (x) => {
        let indexOfClosest = -1, minDistance = 999999, i = 0;

<<<<<<< HEAD
        for (let note of artist.staves[0].note_notes) {
=======
        if (artist.staves.length===0) {
            console.log("No staves in artist!");
            return -1;
        }

        for (let note of artist.staves[0].note_notes) { // later: use currentStave
            console.log("CHECK1 X, absX: ", note.getX(), note.getAbsoluteX());
>>>>>>> 575cae55753935561640636dc7b7198ca3264217
            let distance = Math.abs(x - note.getAbsoluteX());
            if (distance < minDistance) {
                indexOfClosest = i;
                minDistance = distance;
            }
            i++;
        }

        return indexOfClosest;
    };

    const setCurrentNote = (noteIndex, staveNote) => {
        const key = staveNote.keyProps[0];
        const currentDot = staveNote.dots && staveNote.dots > 0;
        const currentAccidental = getCurrentAccidental(staveNote);
        let currentNote = {};
        currentNote.note = key.key;
        currentNote.octave = key.octave;
        currentNote.duration = staveNote.duration;
        currentNote.dot = !!currentDot;
        currentNote.accidental = currentAccidental;
        currentNote.index = noteIndex;
        dispatch(setSelectedNote(currentNote));
    }

    const getCurrentAccidental = staveNote => {
        if (staveNote.getAccidentals()) {
            const accidental = staveNote.getAccidentals()[0].type;
            if (accidental === "bb") {
                return vtNames["bb"];
            } else if (accidental === "b") {
                return vtNames["b"];
            } else {
                return accidental;
            }
        } else {
            return "";
        }
    }

<<<<<<< HEAD
    const passStaves = () => {
        if (props.passStaves && artist.staves) {
            props.passStaves(artist.staves);
=======
    const setNoteColor = (noteIndex, color, stave=0, voice=0) => {
        const note = artist.staves[stave].note_voices[voice][noteIndex];
        if (note) {
            console.log("PAINT Going to paint note: ", note.keys);
            const noteHeads = note.getElem().getElementsByClassName("vf-notehead");
            const stems = note.getElem().getElementsByClassName("vf-stem"); //[0].firstChild.setAttribute("stroke", color);
            const modifiers = note.getElem().getElementsByClassName("vf-modifiers"); // accidentals etc
            // TODO (tarmo): beamed stems. What is the classname of a beam? beamgroup?
            // TODO (tarmo): and dots are not colored yet
            // maybe -  find all children of note.getElem() and if there is property fill or stroke, change it..
            console.log("noteheads, stems: ", noteHeads.length, stems.length );
            for (let element of noteHeads) {
                if (element.firstChild)
                    element.firstChild.setAttribute("fill", color);
            }
            for (let element of stems) {
                if (element.firstChild)
                    element.firstChild.setAttribute("stroke", color);
            }
            for (let element of modifiers) {
                if (element.firstChild)
                    element.firstChild.setAttribute("fill", color);
            }
        }
    }

    const markWrongNotes = () => { // take the indexes of wrong notes from props and mark them
        console.log("wrong notes in markWrongNotes: ", props.wrongNoteIndexes, props.name)
        if (props.wrongNoteIndexes) {
            for (let stave=0; stave<props.wrongNoteIndexes.length; stave++ ) {
                for (let noteIndex of props.wrongNoteIndexes[stave]) {
                    if (noteIndex < artist.staves[stave].note_notes.length) {
                        console.log("wrong note: ", noteIndex, artist.staves[stave].note_notes[noteIndex].keys);
                        setNoteColor(noteIndex, "red", stave);
                    } else {
                        console.log("markWrongNotes: not so many notes in artist ");
                    }
                }
            }
        }

    }

    // TODO: check for chord - vtNote coulde bey also and array of keys. Not supported yet.
    const insertNote = (vtNote, duration = "4",  index=-1, voice=0,  stave=0) => { // index -1 means to the end
        if (index>=0) {
            notationInfo.staves[stave].voices[voice].notes.splice(index, 0, {keys:[vtNote], duration: duration} );
        } else {
            notationInfo.staves[stave].voices[voice].notes.push( {keys:[vtNote], duration: duration} );
        }
        //console.log("NotionInfo to vtString: ", notationInfoToVtString());
        redraw( notationInfoToVtString() );
    };

    const removeNote = ( index=-1, voice=0,  stave=0) => {
        if (notationInfo.staves[stave].voices[voice].notes.length==0) {
            console.log("stave/voice is empty, nothing to remove: ", stave, voice);
            return;
        }

        if (index>=0) {
            notationInfo.staves[stave].voices[voice].notes.splice(index, 1);
        } else { // -1 stand for last note
            notationInfo.staves[stave].voices[voice].notes.pop();
        }
        redraw( notationInfoToVtString() );
    }

    // TODO: maybe also add changePitch and changeDuration functions, if needed. But remove and insert should do it.

    const notationInfoToVtString = () => {
        let vtString = "";
        // TODO: options
        for (let stave of notationInfo.staves) {
            vtString += `stave clef=${stave.clef} key=${stave.key} time=${stave.time} \n`;
            for (let voice of stave.voices) {
                vtString += "voice\n";
                if (voice.notes.length>0) {
                    vtString += "notes ";
                    for (let note of  voice.notes) {
                        // test if chord or single note. Several keys ->  ( . .  ) notation
                        if (note.keys.length>0) {
                            let noteString = "";
                            if (note.keys.length>1) {
                                noteString = `( ${note.keys.join(",")} )`;
                            } else if (note.keys.length==1) {
                                noteString = note.keys[0];
                            }
                            if ( note.keys[0]==="|" || note.keys[0].startsWith("=")  ) { // barline
                                vtString += ` ${note.keys[0]} `;
                            } else {
                                vtString += ` :${note.duration.replace(/\./g, "d")} ${noteString.replace(/b/g, "@")}`; // for any case, VexFlow->VexTab: dot -> d, (flat) b - > @
                            }
                        }
                    }
                }
            }
        }
        return vtString;
    };

    // test, works but formatting goes wrong...
    const addNoteToArtist = (note, durationString, showAccidental=true) => { // like addNote("C#/4", "8.", false))
        let durationValue, dotted;
        if (durationString.endsWith(".") || durationString.endsWith("d") ) {
            durationValue = durationString.slice(0, -1);
            dotted = true;
        } else {
            durationValue = durationString;
            dotted = false;
        }
        artist.setDuration(durationValue, dotted);
        let accidentals = "";
        if (note[1] in ["#", "b"] && showAccidental) {
            accidentals = note[1];
        }

        //artist.addStaveNote({ spec:[`${note}`], accidentals:[`${accidentals}`] });
        artist.addStaveNote({ spec:[`${note}`], accidentals:"" });

        artist.render(renderer);
    };

    const createVexTabString = (notes) => {
        const startString = "stave "; //"options space=20\n stave \n ";
        const clefString = (props.clef) ? "clef="+props.clef+"\n" : "";
        const keyString = (props.keySignature) ? "key="+props.keySignature+"\n" : "";
        const timeString = (props.time) ?  "time="+props.time+"\n" : "";
        const notesString =  (notes) ? "\nnotes " + notes + " \n" : "";
        const endString = ""; //"\noptions space=20\n";
        const vtString = startString + clefString + keyString + timeString + notesString + endString;
        console.log (vtString, props.name);
        return vtString;
    };

    // test: pass staves to parent:
    const passStaves = () => {
        if (props.passStaves && artist.staves.length>0) {
            props.passStaves( artist.staves);
>>>>>>> 575cae55753935561640636dc7b7198ca3264217
        }
    }

    const redraw = (notes) => {
        if (!vexTab) {
            console.log("vexTab not initialized!");
            return;
        }

        if (!renderer) {
            console.log("renderer is null");
            return;
        }

        try {
            vexTab.reset();
            artist.reset();

            if (! notes.toString().trim().endsWith("=|=")) { // always add end bar, if not present:
                if (notes.toString().trim().endsWith("voice")) {
                    console.log("No notes, empty voice");
                    notes += "\nnotes =|=";
                } else {
                    notes = notes.trim() + " =|=";
                }
            }

            if (notes.toString().trim().startsWith("stave") ) { // already full vextab string
                vexTab.parse(notes);
            } else {
                vexTab.parse(createVexTabString(notes));
            }

            artist.render(renderer);
            if (props.wrongNoteIndexes) {
                markWrongNotes();
            }
            passStaves();

        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <div className={'vtDiv'} ref={vtDiv} />
            {props.showInput && <NotationInput />}
        </div>
    );
};

export default Notation;

