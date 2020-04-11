import React, {useEffect, useRef} from 'react';
import {Artist, VexTab, Flow} from 'vextab/releases/vextab-div'

const Notation = (props) => {
    useEffect(() => {
        vexTabTest();
    }, []);

    const vexTab = useRef(null);

    const vexTabTest = () => {
        console.log("Artist: ", typeof(Artist),typeof (VT));
        //const VexTab = VT.VexTab;
        //const Artist = VT.Artist;
        console.log("Type of VexTabDiv", typeof (VexTabDiv), typeof (VexTab));
        const Renderer =  Flow.Renderer;   //Vex.Flow.Renderer;
        // = VexTabDiv.Vex.Flow.Renderer; - error: vextab__WEBPACK_IMPORTED_MODULE_11___default.a.Vex is undefined

// Create VexFlow Renderer from canvas element with id #boo.
        const renderer = new Renderer(vexTab.current, Renderer.Backends.SVG);

// Initialize VexTab artist and parser.
        const artist = new Artist(10, 10, 600, {scale: 0.8}); // this seems not to work...
        const vextab = new VexTab(artist);

        try {
            // Parse VexTab music notation passed in as a string.
            vextab.parse(props.notes)

            // Render notation onto canvas.
            artist.render(renderer);
        } catch (e) {
            console.log(e);
        }
    };


    return <div ref={vexTab}>SCORE</div>;
};

export default Notation;