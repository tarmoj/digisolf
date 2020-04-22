import React, {useEffect, useRef, useState} from 'react';
import {Artist, VexTab, Flow} from 'vextab/releases/vextab-div'
import {useTranslation} from "react-i18next"
import {Input, Button} from "semantic-ui-react";
import {useDispatch} from "react-redux";
import {setUserEnteredNotes} from "../actions/exercise";
import {makeVexTabChord} from "../util/intervals";
import {getNoteByName} from "../util/notes";
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

    const vexTabInit = () => {
        console.log("**** VexTab INIT ****");
        if (!renderer) {
            const renderer = new Flow.Renderer(vtDiv.current, Flow.Renderer.Backends.SVG);
            setRenderer(renderer);
        }
        if (!artist) {
            const width = (props.width) ? props.width : 600;
            const scale = (props.scale) ? props.scale : 0.8;
            const artist = new Artist(10, 10, width, {scale: scale}); // x and y hardcoded for now...
            setArtist(artist);
            const vexTab = new VexTab(artist);
            setVexTab(vexTab);
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

