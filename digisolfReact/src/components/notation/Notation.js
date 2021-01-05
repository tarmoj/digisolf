import React, {useEffect, useRef, useState} from 'react';
import {Artist, Flow, VexTab} from 'vextab/releases/vextab-div';
import NotationInput from "./NotationInput";
import {vtNames, notationInfoToVtString} from "./notationUtils";
import {useSelector, useDispatch} from "react-redux";
import {
    resetState,
    setAllowInput,
    setSelectedNote,
    setSelectedNoteSet,
    setSelectedStaff
} from "../../actions/askDictation";
import {scale, createVexTabString, width} from "./vextabUtils";
import {deepClone} from "../../util/util";

const Notation = (props) => {
    const vtDiv = useRef(null);

    const [renderer, setRenderer] = useState(null);
    const [artist, setArtist] = useState(null);
    const [vexTab, setVexTab] = useState(null);

    const inputNotation = useSelector(state => state.askDictationReducer.inputNotation);
    const selectedNote = useSelector(state => state.askDictationReducer.selectedNote);
    const previousSelectedNote = useSelector(state => state.askDictationReducer.previousSelectedNote);
    const selectedNoteSet = useSelector(state => state.askDictationReducer.selectedNoteSet);
    const correctNotation = useSelector(state => state.askDictationReducer.correctNotation);
    //const currentStaff = useSelector(state => state.askDictationReducer.staff);
    let currentStaff = 0;

    const dispatch = useDispatch();

    useEffect(() => {
        initializeVexTab();
    }, []);

    useEffect(() => {
        if (artist) {
            artist.width = props.width;
        }
    }, [props.width]);

    useEffect(() => {
        if (props.name === "inputNotation" && (inputNotation || !selectedNoteSet || previousSelectedNote.index !== selectedNote.index )) {
            redraw(notationInfoToVtString(inputNotation));
        }
    }, [inputNotation, selectedNoteSet, previousSelectedNote, selectedNote]);

    useEffect(() => {
        if (props.name === "inputNotation" && vexTab) {
            redraw(notationInfoToVtString(inputNotation));
        } else {
            console.log("VexTab is null", props.name);
        }
    }, [inputNotation, vexTab]);

    useEffect(() => {
        if (props.name === "correctNotation" && correctNotation && vexTab) {
            redraw(notationInfoToVtString(correctNotation));
        }
    }, [correctNotation, vexTab]);


    useEffect(() => {
        if (selectedNoteSet && artist) {
            //test:

            //const note = artist.staves[currentStaff].note_notes[selectedNote.index]; // <- currentStaff always 0 here. Maybe bring in from selectedNote
            //console.log("selectedNote effect. currentStaff, note: ", currentStaff, note.keys);
            const note = artist.staves[selectedNote.staff].note_notes[selectedNote.index];

            if (previousSelectedNote.index === selectedNote.index) {    // Clicked-on note is the same as previously selected note
                dispatch(setSelectedNoteSet(false));
            } else {
                highlightNote(note);
            }
        }
    }, [selectedNote]);

    useEffect(() => {
        if (props.wrongNoteIndexes) {
            markWrongNotes();
        } else {
            redraw(notationInfoToVtString(inputNotation));
        }
    }, [props.wrongNoteIndexes]);

    useEffect(() => {
        if (renderer !== null) {
            renderer.getContext().svg.onclick = (event) => handleClick(event);
            redraw("");
        }
    }, [renderer]);

    /*useEffect(() => {
        if (props.notes.staves) {
            redraw(notationInfoToVtString(props.notes));
        }
    }, [props.notes, vexTab]);*/

    useEffect(() => {
        if (props.vtString) {
            redraw(props.vtString);
        }
    }, [props.vtString, vexTab]);

    const initializeVexTab = () => {
        const newArtist = artist ? Object.assign({}, artist) : new Artist(10, 10, props.width, {scale: scale});
        newArtist.width = props.width;
        setArtist(newArtist);
        const vexTab = new VexTab(newArtist);
        setVexTab(vexTab);
        const renderer = new Flow.Renderer(vtDiv.current, Flow.Renderer.Backends.SVG);
        setRenderer(renderer);
    };

    const handleClick = (event) => {
        if (props.showInput) {
            const x = event.layerX / scale;
            const y = event.layerY / scale;


            // check on which staff it is clicked on:
            if (artist.staves.length > 1) { // stave.note gives different geometric info
                const borderLineY = artist.staves[1].note.getYForLine(-2); // approximately second upper ledgerline as limit
                //console.log("click to find stave: ", y, artist.staves[0].note.getYForLine(0), artist.staves[1].note.getYForLine(1), artist.staves[1].note.getYForLine(-2)   );
                const staff =  (y<borderLineY) ? 0 : 1;
                console.log("Staff clicked: ", staff);
                // draw a rectangle to show the active stave
                // if (renderer) {
                //     const box = artist.staves[staff].note.getBoundingBox();
                //     console.log(box);
                //     renderer.getContext().rect(15, y, 200, 100, { fill: "green", opacity: "0.2" } ); // does not do anything
                // }
                if (currentStaff !== staff) {
                    currentStaff = staff;
                    dispatch(setSelectedStaff(staff));
                }

            }

            const closestIndex = findClosestNoteByX(x);
            if (closestIndex >= 0) {
                const note = artist.staves[currentStaff].note_notes[closestIndex];
                setCurrentNote(closestIndex, note);
                console.log(note.keys, currentStaff);
                //console.log(inputNotation)
            }
        }
    };

    const highlightNote = (note, color = "lightblue") => {
        if (note && renderer) {
            console.log("Note in higlight: ", note.keys ); // this comes always from staff 1...
            renderer.getContext().rect(note.getAbsoluteX()-10, note.stave.getYForTopText()-10, note.width+20, note.stave.height+10,
            { fill: color, opacity: "0.2" } );
        }
    }

    const findClosestNoteByX = (x) => {
        let indexOfClosest = -1, minDistance = 999999, i = 0;

        for (let note of artist.staves[currentStaff].note_notes) {
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
        //tarmo test:
        currentNote.staff = currentStaff;
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

    const markWrongNotes = () => { // take the indexes of wrong notes from props and mark them
        for (let i = 0, n = props.wrongNoteIndexes.length; i < n; i++) {
            const note = artist.staves[props.wrongNoteIndexes[i].staveIndex].note_notes[props.wrongNoteIndexes[i].noteIndex];
            highlightNote(note, "red");
        }
    };

    const redraw = (notes) => {
        if (!vexTab) {
            console.log("vexTab not initialized!", props.name);
            return;
        }

        if (!renderer) {
            // console.log("renderer is null");
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
        <React.Fragment>
            <div id={props.name} className={'vtDiv center'} ref={vtDiv} />
            {/*{props.showInput &&  <NotationInput selectLastNote={selectLastNote} />}*/}
            {props.showInput &&  <NotationInput />}
        </React.Fragment>
    );
};

export default Notation;

