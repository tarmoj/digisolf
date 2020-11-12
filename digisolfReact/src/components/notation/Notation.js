import React, {useEffect, useRef, useState} from 'react';
import {Artist, VexTab, Flow} from 'vextab/releases/vextab-div'
import {trebleClefNotes} from "../util/notes";
import {getRandomElementFromArray} from "../util/util";
import NotationTable from "./NotationTable";


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

    let selectedNote = "C", selectedAccidental = "", selectedDuration = "4", selectedDot = "", selectedOctave = "4";

    // this is basic structure to keep all the score
    // score includes staves,  staves include voices, voices include notes
    let notationInfo = {
        options: "", // scale, width, space etc, if needed
        staves: [
            {
                clef:"treble",
                key:"C",
                time: "4/4",
                voices: [
                    {
                        notes: [
                            {
                                keys: [], // like ["C/4", "Eb/4", "G/4"] for chord
                                duration: "", // like 4, 8, 2. etc
                            }
                        ]
                    }
                ]
            }
        ]
    };
    let currentStave = 0, currentVoice = 0, lastNote = -1;

    // use like: scoreInfo.staves[0].voices[0].notes[0] = {keys:["C/4"], duration: "2."}
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
        if (renderer !== null) {
            renderer.getContext().svg.onclick = (event) => handleClick(event); //  console.log("OH MY GOD!", event);
            redraw("");
        }
    }, [renderer]);


    const vexTabInit = () => {
        console.log("**** VexTab INIT ****");
        const renderer = new Flow.Renderer(vtDiv.current, Flow.Renderer.Backends.SVG);
        setRenderer(renderer);
    };

    const handleClick = (event) => {
        const x = event.layerX / scale; // võibolla siin ka: (event.layerX - vtDiv.current.offsetLeft / X) vms
        const y =  (event.layerY - vtDiv.current.offsetTop) / scale; // was: clientX, clientY
        console.log("Click coordinates: ",x,y, event);
        // tryout:  check click on notehead and colour it blue
        if (event.target.parentElement.getAttribute("class") === "vf-notehead") {
            console.log("This is notehead!", event.target);
            event.target.setAttribute("fill", "red");
        } else {
            // tryout  to add a note on the line that was clicked
            let line = artist.staves[0].note.getLineForY(y);
            // find note by line
            line = Math.round(line * 2) / 2; // round to nearest 0.5
            for (let i = 0; i < trebleClefNotes.length; i++) { // TODO: use more general note set, can be also bass clef
                if (trebleClefNotes[i].hasOwnProperty("line")) {
                    //console.log(i, possibleNotes[i].line, line)
                    if (trebleClefNotes[i].line === line) {
                        console.log("FOUND ", i, trebleClefNotes[i].vtNote);
                        insertNote(trebleClefNotes[i].vtNote, selectedDuration);
                        //setNotesEnteredByUser(vexTabString);
                        break;
                    }
                }
            }
        }
    };

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
                            vtString += ` :${note.duration.replace(/\./g, "d")} ${noteString.replace(/b/g, "@")}`; // for any case, VexFlow->VexTab: dot -> d, (flat) b - > @
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



    const  createVexTabString = (notes) => {
        const startString = "stave "; //"options space=20\n stave \n ";
        const clefString = (props.clef) ? "clef="+props.clef+"\n" : "";
        const keyString = (props.keySignature) ? "key="+props.keySignature+"\n" : "";
        const timeString = (props.time) ?  "time="+props.time+"\n" : "";
        const notesString =  (notes) ? "\nnotes " + notes + "\n" : "";
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

    const handleNoteInput = () => {
        console.log("Selected note, accidental, duration", selectedNote, selectedAccidental ,selectedDuration);
        let vtNote = selectedNote + selectedAccidental + "/" + selectedOctave;
        insertNote(vtNote, selectedDuration+selectedDot);
    }

    const createInputBlock = () => {
        // temporary, for testing only:
        return !props.showInput ? null : (
          <div>
              Noot: <select onChange={ e => { selectedNote = e.target.value; } } >
              <option value={"C"}>C</option>
              <option value={"D"}>D</option>
              <option value={"E"}>E</option>
              <option value={"F"}>F</option>
              <option value={"G"}>G</option>
              <option value={"A"}>A</option>
              <option value={"B"}>H</option>
            </select>
              Märk: <select onChange={ e => {  selectedAccidental = e.target.value} }>
                <option value={""}>--</option>
                <option value={"#"}>#</option>
                <option value={"@"}>b</option>
                <option value={"n"}>bekaar</option>
          </select>
              Oktav: <select defaultValue={"4"} onChange={ e => {  selectedOctave = e.target.value} }>
              <option value={"3"}>3</option>
              <option value={"4"}>4</option>
              <option value={"5"}>5</option>
          </select>
              Vältus: <select defaultValue={"4"} onChange={ e => {  selectedDuration = e.target.value} }>
              <option value={"1"}>1</option>
              <option value={"2"}>2</option>
              <option value={"4"}>4</option>
              <option value={"8"}>8</option>
              <option value={"16"}>16</option>
              <option value={"32"}>32</option>
          </select>
              Punkteering: <select onChange={ e => {  selectedDot = e.target.value} }>
              <option value={""}>--</option>
              <option value={"d"}>.</option>
              {/*/!*<option value={"dd"}>..</option>*!/ No support for double dot in VexTab...*/}
          </select>

              <button onClick={handleNoteInput}>Sisesta</button>
              <button onClick={removeNote}>Kustuta viimane</button>

          </div>
        );
    }


    return (
        <div>
            <div ref={vtDiv} />
            <NotationTable />
            {createInputBlock()}
        </div>
    );
};

export default Notation;
