import React, {useEffect, useRef, useState} from 'react';
import {Artist, VexTab, Flow} from 'vextab/releases/vextab-div'
import {useTranslation} from "react-i18next"
import {Input, Button} from "semantic-ui-react";
import {useDispatch} from "react-redux";
import {setUserEnteredNotes} from "../actions/exercise";
import {makeVexTabChord} from "../util/intervals";
import {getNoteByName, trebleClefNotes, noteNames} from "../util/notes";
import {capitalizeFirst} from "../util/util";


const Notation = (props) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    // sellel siin vist pole mõtet... Püüdsin props-dele panna vaikeväärtusi, aga ilmselt mitte nii.
    let { width = 600, scale = 0.8, notes = '', clef = '', time = '', keySignature = '' } = props;

    useEffect(() => {
        console.log("First run");
        vexTabInit();
    }, []); // [] teise parameetrina tähendab, et kutsu välja ainult 1 kord

    useEffect(() => {
        console.log("props.notes change");
        redraw(props.notes);
    }, [props.notes]);

    const vtDiv = useRef(null);
    const [artist, setArtist] = useState(null);
    const [renderer, setRenderer] = useState(null);
    const [vexTab, setVexTab] = useState(null);
    const [notesEnteredByUser, setNotesEnteredByUser] = useState("");
    let artist2 = null;


    const vexTabInit = () => {
        console.log("**** VexTab INIT ****");
        if (!vexTab) {
            const renderer = new Flow.Renderer(vtDiv.current, Flow.Renderer.Backends.SVG);
            const width = (props.width) ? props.width : 600;
            const scale = (props.scale) ? props.scale : 0.8;
            const artist = new Artist(10, 10, width, {scale: scale}); // x and y hardcoded for now...
            artist2 = artist;

            // try handling click on canvas:
            renderer.getContext().svg.artist = artist;
            renderer.getContext().svg.addEventListener('click', handleClick, false);

            const vexTab = new VexTab(artist);
            setRenderer(renderer);
            setArtist(artist);
            setVexTab(vexTab);
        }

    };

    const handleClick = (event) => {
        const x = event.layerX / scale; // võibolla siin ka: (event.layerX - vtDiv.current.offsetLeft / X) vms
        const y =  (event.layerY - vtDiv.current.offsetTop) / scale; // was: clientX, clientY
        console.log("Click coordinates: ",x,y, event);
        console.log("artist: ", event.currentTarget.artist);


        // AJUTINE! testi noodi sisestust:
        if (artist2) {
            let line = artist2.staves[0].note.getLineForY(y);
            // find note by line
            line = Math.round(line * 2) / 2; // round to nearest 0.5
            for (let i = 0; i < trebleClefNotes.length; i++) { // TODO: use more general note set, can be also bass clef
                if (trebleClefNotes[i].hasOwnProperty("line")) {
                    //console.log(i, possibleNotes[i].line, line)
                    if (trebleClefNotes[i].line === line) {
                        console.log("FOUND ", i, trebleClefNotes[i].vtNote);
                        const vexTabString = ":4 " + trebleClefNotes[i].vtNote;
                        //setNotesEnteredByUser(vexTabString);
                        redraw(vexTabString);
                        break;
                    }
                }
            }
        } else {
            console.log ("Artist is null");
        }

    };

    const  createVexTabString = (notes) => {
        const startString = "options space=20\n stave \n ";
        const clefString = (props.clef) ? "clef="+props.clef+"\n" : "";
        const keyString = (props.keySignature) ? "key="+props.keySignature+"\n" : "";
        const timeString = (props.time) ?  "time="+props.time+"\n" : "";
        const notesString = (notes) ? "\nnotes " + notes + "\n" : "";
        const endString = "\noptions space=20\n";
        const vtString = startString + clefString + keyString + timeString + notesString + endString;
        console.log(vtString);
        return vtString;
    };

    // TEMPORARY -  need rewrite (clef, proper parsing etc)
    const noteStringToVexTab =  (noteString) => { // input as c1 es1 ci2 -  will be converted to vextab chord for now
        const noteNames = noteString.trim().split(" ");
        const chordNotes = [];
        for (let name of noteNames) {
            const lastChar = name.charAt(name.length-1);
            if ( !(lastChar >= '0' && lastChar <= '9' ) ) { // if octave number is not set, add 1 for 1st octave ( octave 4 in English system)
                name += '1';
            }
            const note = getNoteByName(name);
            if (note !== undefined) {
                chordNotes.push(note);
            } else {
                console.log("Could not find note according to: ", name)
            }
        }
        if (chordNotes.length>0) {
            return makeVexTabChord(chordNotes);
        } else {
            return "";
        }
    };

    const parseLilypondString = (lyString) => {
        const chunks = lyString.trim().split(" ");
        let vtNotes = "";
        for (let i = 0; i<chunks.length; i++) {
            if (chunks[i].trim() === "\\key" && chunks.length >= i+1 ) { // must be like "\key a \major\minor
                console.log("key: ", chunks[i+1], chunks[i+2]);
                //TODO: VT-s peab märkima mažoori kui minoor, leia vastav mažoor
                // kirjaviis VT-s key=Ab, key=F#
                i += 2;
            } else if (chunks[i].trim() === "\\time" && chunks.length >= i+1) { // must be like "\key a \major
                console.log("time: ", chunks[i + 1]);
                i += 1;
                // VT nt: time=2/4
            } else if (chunks[i].trim() === "\\clef" && chunks.length >= i+1) {
                console.log("clef: ", chunks[i + 1]);
                i += 1;
                // VT nt: clef=treble
                //} else if  (chunks[i].trim() === "\\bar" && chunks.length >= i+1) <- handle different barlines
            } else if     (chunks[i].trim() === "|") {
                console.log("Barline");
                 vtNotes += " | ";
            } else  { // might be a note or error
                const index = chunks[i].search(/[,'\\\d\s]/); // in lylypond one of those may follow th note: , ' digit \ whitespace or nothing
                let noteName;
                if (index>=0) {
                    noteName = chunks[i].slice(0, index);
                } else {
                    noteName = chunks[i];
                }
                let vtNote = "";

                if (noteName === "r") { // rest
                    vtNote = "##";
                } else {

                    if (! noteNames.includes(noteName)) { // ERROR
                        console.log(noteName, " is not a recognized note or keyword.");
                        //TODO: error message for user on screen
                        break;
                    }
                    console.log("noteName is: ", noteName);
                    vtNote = noteName[0].toUpperCase();
                    if (vtNote === "H") {
                        vtNote = "B"; // german to Scandinavian/English B
                    }

                    if (noteName.length > 1) {
                        let ending;

                        if (["as", "es", "eses"].includes(noteName)) { // handle exceptions of the vowel notenames
                            ending = "es";
                        } else if ( ["ases", "eses"].includes(noteName)) {
                            ending = "eses";
                        } else {
                            ending = noteName.slice(1);
                        }

                        switch (ending) {
                            case "eses":
                                vtNote += "@@";
                                break;
                            case "es":
                                vtNote += "@";
                                break;
                            case "is":
                                vtNote += "#";
                                break;
                            case "isis":
                                vtNote += "##";
                                break;
                        }
                    }

                    //TODO: octave from relative writing
                    let octave = "4"; // võibolla praegu: kui ' - 2. oktav, ilma -1, ,   väike... ?
                    vtNote += "/" + octave;
                }

                // duration
                const re = /\d+/;
                const duration = re.exec(chunks[i]);
                if (duration) {
                    vtNote = ":" + duration + " " + vtNote + " ";  //` :${duration} ${vtNote}. `; // in VT duration is before note(s)
                }
                console.log("vtNote: ", vtNote);
                vtNotes += vtNote;

            }
        }
        redraw(vtNotes);
        console.log("Parsed notes: ", vtNotes);
    };


    const redraw = (notes) => {
        if (!vexTab) {
            console.log("vexTab not initialized!");
            return;
        }
        try {
            // Parse VexTab music notation passed in as a string.
            vexTab.reset();
            artist.reset();
            vexTab.parse( createVexTabString(notes) );
            artist.render(renderer);
        } catch (e) {
            console.log(e);
        }
    }


    const renderNotes = () => {
        //test
        parseLilypondString(notesEnteredByUser);
        return;

        const vexTabString = noteStringToVexTab(notesEnteredByUser);
        redraw(vexTabString);
        dispatch(setUserEnteredNotes(vexTabString));
        // redraw(notesEnteredByUser);
        // dispatch(setUserEnteredNotes(notesEnteredByUser));
    };


    return (
        <div hidden={ props.visible ? 0 : 1}>
            <div>
                <Input
                    onChange={e => {setNotesEnteredByUser(e.target.value)}}
                    onKeyPress={ e=> { if (e.key === 'Enter') renderNotes()  }}
                    placeholder={'nt: a c2 es2'}
                    value={notesEnteredByUser}
                />
                <Button onClick={renderNotes}>{ capitalizeFirst( t("render") )}</Button>
            </div>
            <div>
                <div ref={vtDiv} ></div>
            </div>
        </div>
    )
};

export default Notation;

