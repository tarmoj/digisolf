import React, {useEffect, useRef, useState} from 'react';
import {Artist, VexTab, Flow} from 'vextab/releases/vextab-div'
import {trebleClefNotes} from "../../util/notes";
import {getRandomElementFromArray} from "../../util/util";
import NotationTable from "./NotationTable";
import {defaultStateValues, vtNames, defaultNotationInfo} from "./notationConstants";

let notationInfo = defaultNotationInfo;
let artist = new Artist(10, 10, 600, {scale: 1}); // handleCLick works if artis is defined outside of the Notation component
// how to set the width and scale that come from Notation.props?


const Notation = (props) => {
    // sellel siin vist pole mõtet... Püüdsin props-dele panna vaikeväärtusi, aga ilmselt mitte nii.
    // let { width = 600, scale = 0.8, notes = '', clef = '', time = '', keySignature = '' } = props;

    const width = (props.width) ? props.width : 600;
    const scale = (props.scale) ? props.scale : 0.8;

    const vtDiv = useRef(null);
    //artist = new Artist(10, 10, width, {scale: scale}); // moved outside of Notation component
    const [renderer, setRenderer] = useState(null);
    //let renderer = null;
    const vexTab = new VexTab(artist);
    Artist.NOLOGO = true;

    // user selected items
    const [note, setNote] = useState(defaultStateValues.note);
    const [accidental, setAccidental] = useState(defaultStateValues.accidental);
    const [duration, setDuration] = useState(defaultStateValues.duration);
    const [dot, setDot] = useState(defaultStateValues.dot);
    const [octave, setOctave] = useState(defaultStateValues.octave);

    let currentNoteIndex;

    useEffect(() => {
        console.log("First run");
        vexTabInit();
    }, []); // [] teise parameetrina tähendab, et kutsu välja ainult 1 kord

    useEffect(() => {
        if (props.notes) {
            redraw(props.notes);
        }
        console.log("props.notes change ", props.notes);
    }, [props]);

    useEffect(() => {
        if (renderer !== null) {
            renderer.getContext().svg.onclick = (event) => handleClick(event); //  console.log("OH MY GOD!", event);
            redraw("");
        }
    }, [renderer]);

    useEffect(() => {
        refreshNote();
    }, [octave]);



    // TODO 22.11.2020: think this over. has to target a specific note, not just the last one
    // Tarmo: insertNote have parameters index, voice, staff to select the note
    // probably we need currentNoteIndex, currentVoice, currentStaff to use with addNote and removeNote
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
        console.log("**** VexTab INIT ****");
        const renderer = new Flow.Renderer(vtDiv.current, Flow.Renderer.Backends.SVG);
        setRenderer(renderer);
    };

    const handleClick = (event) => {
        console.log("DIV data: ", vtDiv.current, vtDiv.current.offsetLeft  )
        const x =  event.layerX / scale; // was: (event.layerX - vtDiv.current.offsetLeft) / scale
        const y =  event.layerY  / scale; // was: (event.layerY - vtDiv.current.offsetTop)
        console.log("CHECK1 Click coordinates: ",x,y, event);
        const closestIndex = findClosestNoteByX(x) ;
        //TODO 23.11.20: setCurrentNoteIndex(closestInedex), setSelectedNote vms


        if (closestIndex>=0) {
            const note = artist.staves[0].note_notes[closestIndex];
            setCurrentNote(closestIndex, note);
            // draw a semitransparent rect around selected noted
            redraw(notationInfoToVtString()); // to clear the previous rectangle
            renderer.getContext().rect(note.getAbsoluteX()-10, note.stave.getYForTopText()-10, note.width+20, note.stave.height+10,
                { fill: "lightblue", opacity:"0.2" } );
        }


        // tryout:  check click on notehead and colour it blue
        if (event.target.parentElement.getAttribute("class") === "vf-notehead") {
            console.log("This is notehead!", event.target);
            event.target.setAttribute("fill", "red");
        } else {
            if (artist.staves.length===0) {
                console.log("No staves!");
                return;
            }


            // tryout  to add a note on the line that was clicked
            let line = artist.staves[0].note.getLineForY(y);
            // find note by line
            line = Math.round(line * 2) / 2; // round to nearest 0.5
            for (let i = 0; i < trebleClefNotes.length; i++) { // TODO: use more general note set, can be also bass clef
                if (trebleClefNotes[i].hasOwnProperty("line")) {
                    //console.log(i, possibleNotes[i].line, line)
                    if (trebleClefNotes[i].line === line) {
                        //console.log("FOUND ", i, trebleClefNotes[i].vtNote);

                        //insertNote(trebleClefNotes[i].vtNote, "4"); //  kui see on välja kommenteeritud, siis Number of notes on alati 0
                        break;
                    }
                }
            }
        }
    };

    //test:
    const findClosestNoteByX = (x) => {
        // find closest note -  compare note.getAbsoluteX & x
        let indexOfClosest = -1, minDistance = 999999, i = 0;

        for (let note of artist.staves[0].note_notes) { // later: use currentStave
            console.log("CHECK1 X, absX: ", note.getX(), note.getAbsoluteX());
            let distance = Math.abs(x - note.getAbsoluteX());
            if (distance < minDistance) {
                indexOfClosest = i;
                minDistance = distance;
            }
            i++;
        }

        console.log("CHECK1 Closest note to the click: ", indexOfClosest);
        return indexOfClosest;
    }

    const setCurrentNote = (noteIndex, staveNote) => {
        currentNoteIndex = noteIndex;
        const key = staveNote.keyProps[0];
        setNote(key.key);
        setOctave(key.octave);
        setAccidental(key.accidental);
        setDuration(staveNote.duration);
        setDot(staveNote.dots && staveNote.dots > 0);
    }

    // notationInfo functions ------------------------

    const vtStringToNotationInfo  =  (vtString) => {
        // quite complex.
        // see vextab.coffee function parse and parser.parse (vextab.jison)
        // maybe -  rather - read it from artist.staves

    };



    // DYNAMIC NOTE INPUT  ----------------------------

    // just for testing, does not support chords, different voices etc
    const addRandomNote = () => {
        const noteNames =  ["C", "D", "E", "F", "G", "A", "B"];
        const accidentals = ["","#","b"];
        const durations = ["8", "4", "2", "4.", "2."]
        const note = getRandomElementFromArray(noteNames)+getRandomElementFromArray(accidentals) + "/4"; // middle octave
        const duration =  getRandomElementFromArray(durations);

        //addNoteToArtist(note, duration);
        insertNote(note, duration);
    };


    const deleteLastNote = (staveNo = 0) => {
        if (artist.staves[0]) {
            if (artist.staves[0].note_notes.length>0) {
                artist.staves[0].note_notes.pop();
            }
        }
          artist.draw(renderer);

    }

    const addBarline = () => {
        insertNote("|", 0);
    }

    const addEndBarline = () => {
        insertNote("=|=", 0);
    }

    const addNote = () => {
        if (note) {
            const isRestSelected = selected.note === vtNames["rest"];
            const dot = selected.dot ? vtNames["dot"] : "";
            const note = isRestSelected ? selected.note : selected.note + selected.accidental + "/" + selected.octave;
            const duration = selected.duration + dot;
            insertNote(note, duration);
        } else {
            console.log("No note/rest selected");
        }
    }

    // TODO: check for chord - vtNote coulde bey also and array of keys. Not supported yet.
    const insertNote = (vtNote, duration = "4",  index=-1, voice=0,  staff=0) => { // index -1 means to the end
        if (index>=0) {
            notationInfo.staves[staff].voices[voice].notes.splice(index, 0, {keys:[vtNote], duration: duration} );
        } else {
            notationInfo.staves[staff].voices[voice].notes.push( {keys:[vtNote], duration: duration} );
        }
        console.log("NotionInfo to vtString: ", notationInfoToVtString());
        redraw( notationInfoToVtString() );
    };

    const removeNote = ( index=-1, voice=0,  staff=0) => {
        if (notationInfo.staves[staff].voices[voice].notes.length==0) {
            console.log("Staff/voice is empty, nothing to remove: ", staff, voice);
            return;
        }

        if (index>=0) {
            notationInfo.staves[staff].voices[voice].notes.splice(index, 1);
        } else { // -1 stand for last note
            notationInfo.staves[staff].voices[voice].notes.pop();
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
        console.log (vtString);
        return vtString;
    };

    // test: pass staves to parent:
    const passStaves = () => {
        if (props.passStaves && artist.staves) {
            props.passStaves( artist.staves);
        }
    }

    // notes can be yct also a full vextab string, then it must begin with keyword 'stave'
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
            // Parse VexTab music notation passed in as a string.

            if (! notes.toString().trim().endsWith("=|=")) { // always add end bar, if not present:
                if (notes.toString().trim().endsWith("voice")) {
                    console.log("No notes, empty voice");
                    notes += "\nnotes =|=";
                } else {
                    notes =  notes.trim() + " =|=";
                }
            }

            vexTab.reset();
            artist.reset();
            if (notes.toString().trim().startsWith("stave") ) { // already full vextab string
                vexTab.parse( notes );
            } else {
                vexTab.parse(createVexTabString(notes));
            }

            artist.render(renderer);
            passStaves();

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <div className={'vtDiv'} ref={vtDiv} />
            <div>
                <button onClick={addBarline}>Taktijoon</button>
                <button onClick={addEndBarline}>Lõpujoon</button>
            </div>
            {props.showInput && <NotationTable addNote={addNote} removeNote={removeNote} selected={selected} setters={setters} />}
        </div>
    );
};

export default Notation;

