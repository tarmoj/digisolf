import React, {useEffect, useRef, useState} from 'react';
import {Artist, VexTab, Flow} from 'vextab/releases/vextab-div'




const Notation = (props) => {

    const { notes = ':4 C/4', clef = 'treble', time = null, keySignature = null,  ...restProps } = props;

    useEffect(() => {
        console.log("First run");
        vexTabInit();
        //vexTabTest();
    }, []); // [] teise parameetrina tähendab, et kutsu välja ainult 1 kord

    useEffect(() => {
        console.log("re-render");
        if (vexTab) {
            redraw();
        }
    });

    const vtDiv = useRef(null);
    const [artist, setArtist] = useState(null);
    const [renderer, setRenderer] = useState(null);
    const [vexTab, setVexTab] = useState(null);

    const vexTabInit = () => {
        console.log("**** VexTab INIT ****");
        if (!renderer) {
            const renderer = new Flow.Renderer(vtDiv.current, Flow.Renderer.Backends.SVG);
            setRenderer(renderer);
        }
        if (!artist) {
            const artist = new Artist(10, 10, 600, {scale: 0.8});
            setArtist(artist); // TODO: parameters from props
            const vexTab = new VexTab(artist);
            setVexTab(vexTab);
        }
    };

    const  createVexTabString = () => {
        const startString = "options space=20\n stave \n ";
        const clefString = (props.clef) ? "clef="+props.clef+"\n" : "";
        const keyString = (props.keySignature) ? "key="+props.keySignature+"\n" : "";
        const timeString = (props.time) ?  "time="+props.time+"\n" : "";
        const notesString = (props.notes) ? "\nnotes " + props.notes + "\n" : "";
        const endString = "\noptions space=20\n";
        const vtString = startString + clefString + keyString + timeString + notesString + endString;
        console.log("Notes:", props.notes, notes);
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

/*
            <div>
                {"Noodid:"} <input id={"vtNotes"} type={"text"} size={12}/>
                <input type={"button"} onClick={redraw}>Näita</input>
            </div>

 */
    return (
        <div>

            <div>

                <div ref={vtDiv}></div>
            </div>
        </div>
    )
};

export default Notation;

