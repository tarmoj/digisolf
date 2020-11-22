 export const dictations = [
		{ category: "2voice_level1",
            title: "2v 2b",
            soundFile: "../sounds/dictations/2voice/2b.mp3",
            notationType: "vextab", // vextab VT or lilypond
            notation:
                `
stave time=4/4 clef=treble
voice
notes :4 E/5 D/5 C/5 D/5 | B/4 A/4 :2 G/4 

stave time=4/4 clef=treble
voice 
notes :2 C/4 E/4 | D/4 G/3    =|= 
        `
        },

     { category: "2voice_level1",
            title: "2v 7a",
            soundFile: "../sounds/dictations/2voice/7a.mp3",
            notationType: "vextab", // vextab VT or lilypond
            notation:
                `
stave time=4/4 key=G
voice
notes :4 B/4 D/5 C/5 B/4 | A/4 D/5 :2 B/4 =|=

stave time=4/4 clef=bass key=G
voice
notes :4 G/3 B/3 A/3 D/3 | F#/3 D/3 :2 G/3 =|=
        `
        },

 
];
