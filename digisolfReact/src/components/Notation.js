import React, {useEffect, useRef, useState} from 'react';
import {Artist, VexTab, Flow} from 'vextab/releases/vextab-div'




const Notation = (props) => {


    const { width = 600, scale = 0.8, notes = '', clef = '', time = '', keySignature = '' } = props;

    useEffect(() => {
        console.log("First run");
        vexTabInit();
    }, []); // [] teise parameetrina tähendab, et kutsu välja ainult 1 kord

    useEffect(() => {
        console.log("re-render");
        redraw();
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
        const notesString = (props.notes) ? "\nnotes " + props.notes + "\n" : "";
        const endString = "\noptions space=20\n";
        const vtString = startString + clefString + keyString + timeString + notesString + endString;
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
                <div ref={vtDiv} hidden={ props.visible ? 0 : 1}></div>
            </div>
        </div>
    )
};

export default Notation;

