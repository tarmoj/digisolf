import React, {useEffect, useRef, useState} from 'react';
import {Artist, VexTab, Flow} from 'vextab/releases/vextab-div'
import {Input, Button} from "semantic-ui-react"; // Inputit ei osanud kasutada -  et saada tema value kätte...




const Notation = (props) => {

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
      redraw(notesEnteredByUser);
    };


    return (
        <div hidden={ props.visible ? 0 : 1}>
            <div>
                <Input onChange={e => setNotesEnteredByUser(e.target.value)} placeholder={props.notes /*':2 (D/4.F#/4.A@/4)'*/} value={notesEnteredByUser}/>
                <Button onClick={renderNotes}>Render</Button>
            </div>
            <div>
                <div ref={vtDiv} ></div>
            </div>
        </div>
    )
};

export default Notation;

