import React, {useEffect, useRef, useState} from 'react';
import {Flow} from 'vextab/releases/vextab-div';
import NotationInput from "./NotationInput";
import {vtNames, notationInfoToVtString} from "./notationUtils";
import {useSelector, useDispatch} from "react-redux";
import {setAllowInput, setSelectedNote, setSelectedNoteSet} from "../../actions/askDictation";
import {artist, vexTab, scale, createVexTabString} from "./vextabUtils";

const Notation = (props) => {

    const vtDiv = useRef(null);
    const [renderer, setRenderer] = useState(null);
    const inputNotation = useSelector(state => state.askDictationReducer.inputNotation);
    const selectedNote = useSelector(state => state.askDictationReducer.selectedNote);
    const previousSelectedNote = useSelector(state => state.askDictationReducer.previousSelectedNote);
    const selectedNoteSet = useSelector(state => state.askDictationReducer.selectedNoteSet);
    const dispatch = useDispatch();

    useEffect(() => {
        initializeVexTab();
        dispatch(setAllowInput(true));
    }, []); 

    useEffect(() => {
        if (inputNotation) {
            redraw(notationInfoToVtString(inputNotation));
        }
    }, [inputNotation]);

    useEffect(() => {
        if (selectedNoteSet) {
            const note = artist.staves[0].note_notes[selectedNote.index];

            if (previousSelectedNote.index === selectedNote.index) {    // Clicked-on note is the same as previously selected note
                dispatch(setSelectedNoteSet(false));
            } else {
                highlightNote(note);
            }
        }
    }, [selectedNote]);

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
        if (props.notes.staves) {
            redraw(notationInfoToVtString(props.notes));
        }
    }, [props]);

    const initializeVexTab = () => {
        console.log("**** Initializing VexTab ****");
        const renderer = new Flow.Renderer(vtDiv.current, Flow.Renderer.Backends.SVG);
        setRenderer(renderer);
    };

    const handleClick = (event) => {
        const x = event.layerX / scale;
        const closestIndex = findClosestNoteByX(x);

        if (closestIndex >= 0) {
            const note = artist.staves[0].note_notes[closestIndex];
            setCurrentNote(closestIndex, note);
            redraw(notationInfoToVtString(inputNotation));
            // highlightSelectedNote(note);
        }
    };

    const highlightNote = (note, color = "lightblue") => {
        if (note) {
            renderer.getContext().rect(note.getAbsoluteX()-10, note.stave.getYForTopText()-10, note.width+20, note.stave.height+10,
            { fill: color, opacity:"0.2" } );
        }
    }

    const findClosestNoteByX = (x) => {
        let indexOfClosest = -1, minDistance = 999999, i = 0;

        for (let note of artist.staves[0].note_notes) {
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
        for (let i = 0, n = props.wrongNoteIndexes.length; i < n; i++) {
            const note = artist.staves[props.wrongNoteIndexes[i].staveIndex].note_notes[props.wrongNoteIndexes[i].noteIndex];
            highlightNote(note, "red");
        }
    };

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

