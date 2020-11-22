import React, {useEffect, useRef, useState} from 'react';
import {Artist, VexTab, Flow} from 'vextab/releases/vextab-div'
import {trebleClefNotes} from "../../util/notes";
import {getRandomElementFromArray} from "../../util/util";
import NotationTable from "./NotationTable";
import {defaultStateValues, vtNames, defaultNotationInfo} from "./notationConstants";

let notationInfo = defaultNotationInfo;

const Notation = (props) => {
    // sellel siin vist pole mõtet... Püüdsin props-dele panna vaikeväärtusi, aga ilmselt mitte nii.
    // let { width = 600, scale = 0.8, notes = '', clef = '', time = '', keySignature = '' } = props;

    const width = (props.width) ? props.width : 600;
    const scale = (props.scale) ? props.scale : 0.8;

    const vtDiv = useRef(null);
    const artist = new Artist(10, 10, width, {scale: scale});
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

    // TODO: insertNote(staff, voice, index), getNote(staff, voice, index), removeNote(staff, voice, index)
    // TODO: rework createVexTabString

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
        console.log("CHECK1 Renderer effect");
        if (renderer !== null) {
            renderer.getContext().svg.onclick = (event) => handleClick(event); //  console.log("OH MY GOD!", event);
            redraw("");
        }
    }, [renderer]);

    useEffect(() => {
        refreshNote();
    }, [octave]);

    // TODO 22.11.2020: think this over. has to target a specific note, not just the last one
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
        const x =  (event.layerX - vtDiv.current.offsetLeft) / scale;
        const y =  (event.layerY - vtDiv.current.offsetTop) / scale;
        console.log("Click coordinates: ",x,y, event);
        findClosestNoteByX(x) ;

        // tryout:  check click on notehead and colour it blue
        if (event.target.parentElement.getAttribute("class") === "vf-notehead") {
            console.log("This is notehead!", event.target);
            event.target.setAttribute("fill", "red");
        } else {
            if (artist.staves.length===0) {
                console.log("No staves!");
                return;
            }

            // tryout: find closest note -  compare note.getAbsoluteX & x
            // try rectangles:
            //const  context = renderer.getContext();
            //const distances = [];
            //console.log("CHECK1 Noote:", artist.staves[0].note_notes.length);
            for (let note of artist.staves[0].note_notes ) {
                console.log("CHECK1 X, absX: ", note.getX(), note.getAbsoluteX() );

                //context.rect(note.getAbsoluteX()-10, note.stave.getYForTopText()-10, note.width+20, note.stave.height+10, { fill: 'darkgreen' });

            }


            // tryout  to add a note on the line that was clicked
            let line = artist.staves[0].note.getLineForY(y);
            // find note by line
            line = Math.round(line * 2) / 2; // round to nearest 0.5
            for (let i = 0; i < trebleClefNotes.length; i++) { // TODO: use more general note set, can be also bass clef
                if (trebleClefNotes[i].hasOwnProperty("line")) {
                    //console.log(i, possibleNotes[i].line, line)
                    if (trebleClefNotes[i].line === line) {
                        console.log("FOUND ", i, trebleClefNotes[i].vtNote);
                        insertNote(trebleClefNotes[i].vtNote, "4"); //  kui see on välja kommenteeritud, siis Number of notes on alati 0
                        // kui see aga toimub, siis findClosestNoteByX näeb nootide arvu, so nootide arvu, mis on sisestatud hiireklõpsuga
                        // ilmselt kuna insertNote() kutsub välja reDraw(), see artist.reset samas tsüklis
                        // kui noodid on sisestatud aga NotationTable kaudu, siis see toimub ilmselt mingis teises state olekus...
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
        console.log("CHECK1 Number of notes: ", artist.staves[0].note_notes.length);

        // does not work -  artist.staves[0].note_notes seems to be empty at this point...
        for (let note of artist.staves[0].note_notes) { // later: use currentStave
            console.log("X, absX: ", note.getX(), note.getAbsoluteX());
            let distance = Math.abs(x - note.getAbsoluteX());
            if (distance < minDistance) {
                indexOfClosest = i;
                minDistance = distance;
            }
            i++;
            //context.rect(note.getAbsoluteX()-10, note.stave.getYForTopText()-10, note.width+20, note.stave.height+10, { fill: 'darkgreen' });
        }

        console.log("Closest note to the click: ", indexOfClosest);
        return indexOfClosest;
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
            const note = isRestSelected ? selected.note : selected.note + selected.accidental + "/" + selected.octave;
            const duration = selected.duration + selected.dot;
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
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <div ref={vtDiv} />
            <div>
                <button onClick={addBarline}>Taktijoon</button>
                <button onClick={addEndBarline}>Lõpujoon</button>
            </div>
            <NotationTable addNote={addNote} removeNote={removeNote} selected={selected} setters={setters} />
        </div>
    );
};

export default Notation;

