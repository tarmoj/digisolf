 export const dictations = [
		{ category: "2voice_level1",
            title: "2v 2b",
            soundFile: "/sounds/dictations/2voice/2b.mp3",
            notationType: "vextab", // vextab VT or lilypond
            notation: 
            {
				stave1: 
				`
		\\clef treble \\time 4/4 
		e''4 d'' c'' d'' |
		h' a' g'2 \\bar "|."
				`,
				stave2: 
				`
		\\clef treble \\time 4/4 
		c'2 e'  |
		d'  g2 \\bar "|."
				`
			},
			
			show: {
				stave1: 
				`
		\\clef treble \\time 4/4 
		e''4 
				`,
				stave2: 
				`
		\\clef treble \\time 4/4 
		c'2 
				`
			}
              
        },

     { category: "2voice_level1",
            title: "2v 7a",
            soundFile: "/sounds/dictations/2voice/7a.mp3",
            notation:
            {
				stave1: 
				`
		\\clef treble \\key g \\major \\time 4/4 
		h'4 d'' c'' h' | a' d'' h'2  \\bar "|."
				`,
				stave2: 
				`
		\\clef bass \\key g \\major \\time 4/4 
		g4 h a d | fis d g2 \\bar "|."
				`
			},
			
		// show:
        //     {
		// 		stave1:
		// 		`
		// \\clef treble \\key g \\major \\time 4/4
		// h'4
		// 		`,
		// 		stave2:
		// 		`
		// \\clef bass \\key g \\major \\time 4/4
		// g4
		// 		`
		// 	},
        
        },

 
];
