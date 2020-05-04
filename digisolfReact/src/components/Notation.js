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
    // let { width = 600, scale = 0.8, notes = '', clef = '', time = '', keySignature = '' } = props;

    const width = (props.width) ? props.width : 600;
    const scale = (props.scale) ? props.scale : 0.8;

    const vtDiv = useRef(null);
    const [artist, setArtist] = useState(new Artist(10, 10, width, {scale: scale}));
    const [renderer, setRenderer] = useState(null);
    const [vexTab, setVexTab] = useState(new VexTab(artist));
    //const [notesEnteredByUser, setNotesEnteredByUser] = useState("");
    let artist2 = null;

    useEffect(() => {
        console.log("First run");
        vexTabInit();
    }, []); // [] teise parameetrina tähendab, et kutsu välja ainult 1 kord

    useEffect(() => {
        if (props.notes !== "") {
            redraw(props.notes);
        }
        console.log("props.notes change ", props.notes);
    }, [props.notes]);

    useEffect(() => {
        if (renderer !== null) {
            redraw();
        }
        console.log("props.notes change ", props.notes);
    }, [renderer]);


    const vexTabInit = () => {
        console.log("**** VexTab INIT ****");
        // if (!vexTab) {
            const renderer = new Flow.Renderer(vtDiv.current, Flow.Renderer.Backends.SVG);
            // try handling click on canvas:
            renderer.getContext().svg.artist = artist;
            renderer.getContext().svg.addEventListener('click', handleClick, false);

            setRenderer(renderer);
            artist2 = artist;
        // }

    };

    const handleClick = (event) => {
        const x = event.layerX / scale; // võibolla siin ka: (event.layerX - vtDiv.current.offsetLeft / X) vms
        const y =  (event.layerY - vtDiv.current.offsetTop) / scale; // was: clientX, clientY
        console.log("Click coordinates: ",x,y, event);
        //console.log("artist: ", event.currentTarget.artist);
        const artist = event.currentTarget.artist;


        // AJUTINE! testi noodi sisestust:
        if (artist) {
            let line = artist.staves[0].note.getLineForY(y);
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
        const notesString = (props.notes) ? "\nnotes " + props.notes + "\n" : "";
        const endString = "\noptions space=20\n";
        const vtString = startString + clefString + keyString + timeString + notesString + endString;
        console.log("notes: ", props.notes);
        return vtString;
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
    };


    return (
        <div hidden={ props.visible ? 0 : 1}  ref={vtDiv} />
    )
};

export default Notation;

