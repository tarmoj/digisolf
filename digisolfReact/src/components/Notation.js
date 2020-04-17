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
        console.log("re-render");
        // kas siin kanda props.notes -> vtNotes, et redraw() saaks need kätte?
        if (props.notes) {
            setVtNotes(props.notes);
        }
        redraw();
    });

    const vtDiv = useRef(null);
    const noteInput = useRef("");
    const [artist, setArtist] = useState(null);
    const [renderer, setRenderer] = useState(null);
    const [vexTab, setVexTab] = useState(null);
    const [vtNotes, setVtNotes] = useState(null);

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

    const  createVexTabString = () => {
        const startString = "options space=20\n stave \n ";
        const clefString = (props.clef) ? "clef="+props.clef+"\n" : "";
        const keyString = (props.keySignature) ? "key="+props.keySignature+"\n" : "";
        const timeString = (props.time) ?  "time="+props.time+"\n" : "";
        const notesString = (vtNotes) ? "\nnotes " + vtNotes + "\n" : "";
        const endString = "\noptions space=20\n";
        const vtString = startString + clefString + keyString + timeString + notesString + endString;
        console.log(vtString);
        return vtString;
    };

    const redraw = () => {
        if (!vexTab) {
            console.log("vexTab not initialized!");
            return;
        }
        try {
            // Parse VexTab music notation passed in as a string.
            vexTab.reset();
            artist.reset();
            vexTab.parse( createVexTabString() );
            artist.render(renderer);
        } catch (e) {
            console.log(e);
        }
    }


    const setNotesFromInput = () => {
      const vtNotes = noteInput.current.value;
      console.log("Input: ", vtNotes);
      //props.notes = vtNotes; // props readonly. Kas kasutada state'i vtNotes? Mis punktis kanda props vtNotes'i?
      setVtNotes(vtNotes);
      redraw();
    };


    return (
        <div>
            <div>
                <input ref={noteInput} placeholder='VexTab notes' value={":2 C-E-G/4"}/>
                <Button onClick={setNotesFromInput}>Render</Button>
            </div>
            <div>
                <div ref={vtDiv} hidden={ props.visible ? 0 : 1}></div>
            </div>
        </div>
    )
};

export default Notation;

