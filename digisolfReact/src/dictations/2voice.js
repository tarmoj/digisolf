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
		 soundFile: "/sounds/dictations/2voice/level1/1a.mp3",
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
		 soundFile: "/sounds/dictations/2voice/level1/2a.mp3",
		 notation:
			 {
				 stave1:
					 `
		 \\time 4/4 
		 e''4  f''4 g''4 e''4  |
		 g''4  f''4 e''2 \\bar "|."
				`,
				 stave2:
					 `
		 \\time 4/4
		 c'4  d'4 e'4 c'4 | h2 c' \\bar  "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "3",
		 soundFile: "/sounds/dictations/2voice/level1/3a.mp3",
		 notation:
			 {
				 stave1:
					 `
		 \\time 4/4
		 e''2  e''2  | d''4 c''4 h'2 \\bar "|."
				`,
				 stave2:
					 `
		\\time 4/4
		c'4  e'4 g'4 c'4  | 
    h4 a4 g2 \\bar  "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "4",
		 soundFile: "/sounds/dictations/2voice/level1/4a.mp3",
		 notation:
			 {
				 stave1:
					 `
		 \\time 4/4
		 e''2  d''4 c''4 | h'2 c''2    \\bar "|."
				`,
				 stave2:
					 `
		 \\time 4/4
		 c'4  g'4 f'4 e'4 |
    a'4 g'4 e'2  \\bar     "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "5",
		 soundFile: "/sounds/dictations/2voice/level1/5a.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\time 4/4
		a'4  h'4 c''4 a'4 | gis'2 a'2 \\bar "|."
				`,
				 stave2:
					 `
		 \\time 4/4
		 c'4  d'4 e'4 c'4  |
    h4 c'8 d'8 c'2 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "6",
		 soundFile: "/sounds/dictations/2voice/level1/6a.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\time 4/4
		a'4  c''4 e''4 gis'4 | h'4 e''4 a'2 \\bar "|."
				`,
				 stave2:
					 `
		\\time 4/4
		a2 h2 |
    d'2 c'2 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "7",
		 soundFile: "/sounds/dictations/2voice/level1/7a.mp3",
		 notation:
			 {
				 stave1:
					 `
	\\time 4/4
	h'4 d''4 c''4 h'4 | a'4 d''4 h'2 \\bar "|."	
				`,
				 stave2:
					 `
		 \\clef bass \\time 4/4
		 g4 h4 a4 d4 | 
		fis4 d4 g2 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "8",
		 soundFile: "/sounds/dictations/2voice/level1/8a.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key g \\major \\time 4/4
		e'4  fis'4 g'4 e''4  | e''4 dis''4 h'2 \\bar "|."
				`,
				 stave2:
					 `
		\\key g \\major \\clef bass \\time 4/4
		 e2 e2 |  h,2 h,2 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "9",
		 soundFile: "/sounds/dictations/2voice/level1/9a.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key f \\major \\time 4/4
    f'4  g'4 a'4 b'4  | c''4 d''4 c''2 \\bar "|."
				`,
				 stave2:
					 `
	\\key f \\major  \\clef bass \\time 4/4
	a,4 c4 f4 g4 |
    a2 b2 \\bar "|."
    
				`
			 }
	 },

	 { category: "2voice_level1",
		 title: "10",
		 soundFile: "/sounds/dictations/2voice/level1/10a.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key f \\major \\time 4/4
    d'4  a'4 b'4 cis'4 | d'4 e'4 f'2 \\bar "|."
				`,
				 stave2:
					 `
		 \\key f \\major \\clef bass \\time 4/4
		 d2 e2 | f4 g4 a2  \\bar "|."
				`
			 }
	 },

// level 2 ----------------------------------------------------------

	 { category: "2voice_level2",
		 title: "II - 22",
		 soundFile: "/sounds/dictations/2voice/level2/22a.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key f \\major \\time 2/4 
    f'4  f'4  | g'4 g'4  | a'4 a'4 c''4 c''4 \\bar "|."
				`,
				 stave2:
					 `
	\\clef bass \\key f \\major \\time 2/4 a8 b8 c'8 a8 | d'8 c'8 c'4 | 
	f8   g8 a8 f8  | b8 a8 a4 \\bar "|."	 
				`
			 }
	 },

	 { category: "2voice_level2",
		 title: "II - 23",
		 soundFile: "/sounds/dictations/2voice/level2/23a.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key d \\minor \\time 2/4 
    d'8  e'8 f'4 | d'2 | d'8 e'8 f'4 | a'2 \\bar "|."
				`,
				 stave2:
					 `
		\\clef bass  \\key f \\major \\time 2/4 
		d4 a,4 | d8 e8 f4  | d4 a,4 | e8 f8 a4 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level2",
		 title: "II - 24",
		 soundFile: "/sounds/dictations/2voice/level2/24a.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key c \\major \\time 3/4 
    a8  h8 c'8 c'8 h8 c'8  | a4  a4 r4 | 
    a8 h8 c'8 h8 c'8 d'8 |  e'4 e'4 r4 \\bar "|."
				`,
				 stave2:
					 `
	\\clef bass	 \\key c \\major \\time 3/4
	r4 a,8 a,8 a,8 a,8  | r4 a,8 a,8 a,8  a,8 | 
	r4 a,8 a,8 a,8 a,8 | r4 e8 f8 e4 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level2",
		 title: "II - 25",
		 soundFile: "/sounds/dictations/2voice/level2/25a.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key g \\major \\time 3/4 
    d''2  d''8 g''8 |  d''4 d''2 |
    c''2 c''8 g''8 | h'4 h'2 \\bar "|."
				`,
				 stave2:
					 `
	\\clef treble  \\key g \\major \\time 3/4 
    h8  c'8 d'4 g'4 | fis'2. |
    g'8 fis'8 e'4 g'4 | d'2. \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level2",
		 title: "II - 26",
		 soundFile: "/sounds/dictations/2voice/level2/26a.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key d \\major \\time 3/4 
    fis'8  g'8 a'4 g'8 fis'8 |
    e'4 a'2 | fis'8 e'8 d'8 fis'8 e'8 a8 d'2. \\bar "|."
				`,
				 stave2:
					 `
		 \\clef bass \\key d \\major \\time 3/4 
		 d2 d4 | cis2 cis4 | d2 a,4 | d4 d,2 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level2",
		 title: "II - 27",
		 soundFile: "/sounds/dictations/2voice/level2/27a.mp3",
		 notation:
			 {
				 stave1:
					 `
	\\key c \\minor \\time 2/4 
    g'8  c''8 c''8 c''8  | b'16 as'16 g'16 f'16  g'4 |
    d'8 g'8 g'8 g'8 | f'16 es'16 d'16 es'16 c'4 \\bar "|."	
				`,
				 stave2:
					 `
	\\clef bass	 \\key es \\major \\time 2/4 
	c8 d8 es8 c8  | es8 f8 g4 | 
	g,8 a,8 h,8 g,8 | c4 c,4 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level2",
		 title: "II - 28",
		 soundFile: "/sounds/dictations/2voice/level2/28a.mp3",
		 notation:
			 {
				 stave1:
					 `
		 \\key e \\minor \\time 2/4 
    g''4  fis''4 |  e''8 h'8  e''4 | fis''8 g''8  a''4 | dis''8 e''8  fis''4 \\bar "|."
				`,
				 stave2:
					 `
		 \\clef bass \\key e \\minor \\time 2/4 
		 e4 e8 h,8 |  e4 e8 h,8 | fis4 fis8 h,8  | h4 h8 h,8 \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level2",
		 title: "II - 29",
		 soundFile: "/sounds/dictations/2voice/level2/29a.mp3",
		 notation:
			 {
				 stave1:
					 `
	\\key b \\major \\time 3/4 
    b8  c'8 d'4 f'4 |  g'8 f'8 es'2 |
    f'8 g'8 a'8 b'8 c''8 es''8 | d''4 f''2 \\bar "|."
				`,
				 stave2:
					 `
	\\clef bass \\key b \\major \\time 3/4 
	b,2 c8 d8 | es2 f8 g8 | f2 g8 a8 | b2.  \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level2",
		 title: "II - 30",
		 soundFile: "/sounds/dictations/2voice/level2/30a.mp3",
		 notation:
			 {
				 stave1:
					 `
		\\key f \\major \\time 3/4 
    a'4  b'8 a'8 g'4 | f'4 a'8 f'8  c'4 | d'8 e'8  f'8 g'8  a'8 b'8 | c''8 d''8 c''2 \\bar "|."
				`,
				 stave2:
					 `
	\\clef treble \\key f \\major \\time 3/4 
    f'2  c'4  | d'2 a4 |  b2 d'4 | c'2. \\bar "|."
				`
			 }
	 },

	 { category: "2voice_level2",
		 title: "II - 31",
		 soundFile: "/sounds/dictations/2voice/level2/31a.mp3",
		 notation:
			 {
				 stave1:
					 `
		 \\key d \\major \\time 4/4 
    d''4 a'4 a'4 a'8 g'8 |
    fis'8 g'8 a'8 h'8 a'2 |
     d''4 a'4 a'4 a'8 h'8  | 
     a'8 fis''8 e''8 a'8 d''4 r4 \\bar "|."
				`,
				 stave2:
					 `
	\\clef bass \\key d \\major \\time 4/4
	d4. d8 d4. d8 |  d8 e8 fis8 g8  fis8 g8 fis4  |
	d4. d8 d4. d8 | fis8 g8 a8 a,8 d4 r4 \\bar "|."
				`
			 }
	 },





];
