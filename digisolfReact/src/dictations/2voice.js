 export const dictations = [
// for testing:

/*

		{ category: "2voice_level1",
            title: "2v 2b",
            soundFile: "/sounds/dictations/2voice/2b.mp3",
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
			

        },

 */

// febr 2021

	 { category: "2voice_level1",
		 title: "1",
		 soundFile: "/sounds/dictations/2voice/X.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\clef "treble" \\key c \\major \\time 4/4 
    e'4  f'4 g'4 a'4  | g'4 f'4 g'2 \\bar "|."
				`,
				 stave2:
					 `
		\\clef "treble" \\key c \\major \\time 4/4 
    c'4  d'4 e'4 f'4 |  e'4 d'4 e'2 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "2",
		 soundFile: "/sounds/dictations/2voice/X.mp3",
		 notation:
			 {
				 stave1:
					 `
		 e''4  f''4 g''4 e''4  |
		 g''4  f''4 e''2 \\bar "|."
				`,
				 stave2:
					 `
		 c'4  d'4 e'4 c'4 | h2 c' \\bar  "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "3",
		 soundFile: "/sounds/dictations/2voice/X.mp3",
		 notation:
			 {
				 stave1:
					 `
		 e''2  e''2  | d''4 c''4 h'2 \\bar "|."
				`,
				 stave2:
					 `
		c'4  e'4 g'4 c'4  | 
    h4 a4 g2 \\bar  "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "4",
		 soundFile: "/sounds/dictations/2voice/X.mp3",
		 notation:
			 {
				 stave1:
					 `
		 e''2  d''4 c''4 | h'2 c''2    \\bar "|."
				`,
				 stave2:
					 `
		 c'4  g'4 f'4 e'4 |
    a'4 g'4 e'2  \\bar     "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "5",
		 soundFile: "/sounds/dictations/2voice/X.mp3",
		 notation:
			 {
				 stave1:
					 `
		a'4  h'4 c''4 a'4 | gis'2 a'2 \\bar "|."
				`,
				 stave2:
					 `
		 c'4  d'4 e'4 c'4  |
    h4 c'8 d'8 c'2 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "6",
		 soundFile: "/sounds/dictations/2voice/X.mp3",
		 notation:
			 {
				 stave1:
					 `
		a'4  c''4 e''4 gis'4 | h'4 e''4 a'2 \\bar "|."
				`,
				 stave2:
					 `
		a2 h2 |
    d'2 c'2 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "7",
		 soundFile: "/sounds/dictations/2voice/X.mp3",
		 notation:
			 {
				 stave1:
					 `
	h'4 d''4 c''4 h'4 | a'4 d''4 h'2 \\bar "|."	
				`,
				 stave2:
					 `
		 \\clef bass
		 g4 h4 a4 d4 | 
		fis4 d4 g2 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "8",
		 soundFile: "/sounds/dictations/2voice/X.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key g \\major 
		e'4  fis'4 g'4 e''4  | e''4 dis''4 h'2 \\bar "|."
				`,
				 stave2:
					 `
		\\key g \\major \\clef bass
		 e2 e2 |  h,2 h,2 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "9",
		 soundFile: "/sounds/dictations/2voice/X.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key f \\major 
    f'4  g'4 a'4 b'4  | c''4 d''4 c''2 \\bar "|."
				`,
				 stave2:
					 `
	\\key f \\major  \\clef bass
	a,4 c4 f4 g4 |
    a2 b2 \\bar "|."
    
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "10",
		 soundFile: "/sounds/dictations/2voice/X.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key f \\major 
    d'4  a'4 b'4 cis'4 | d'4 e'4 f'2 \\bar "|."
				`,
				 stave2:
					 `
		 \\key f \\major \\clef bass 
		 d2 e2 | f4 g4 a2  \\bar "|."
				`
			 }
	 },


];
