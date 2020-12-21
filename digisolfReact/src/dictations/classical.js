// Näited klassikalisest muusikast. Koostanud: Andres Lemba

 export const dictations = [

// level 1 
 
	{
	 category: "classical_level1", title: "1", soundFile: "../sounds/dictations/classical/level1/1_classical_level1.mp3",
            credits: "Cyrillus Kreek - Reekviem I osa",
            notation:
                `
     \\key es \\major \\time 4/4 
    r4 g'4 es'4 f'4 | 
    b1~ | 
    b4 b4 f'4 g'4 | 
    es'1~ | 
    es'4 g'4 f'4 es'4 | 
    b1~ | 
    b4 b4 f'4 g'4 | 
    es'1 \\bar "|."    
        `,
            show: `
            \\key es \\major \\time 4/4
            r4 g'4 es'4 f'4 \\bar "|."
            `,
        },
		
		{
	 category: "classical_level1", title: "2", soundFile: "../sounds/dictations/classical/level1/2_classical_level1.mp3",
            credits: "Olav Ehala - \"Kodulaul\"",
            notation:
                `
         \\clef "treble" \\key g \\major \\time 3/4 
    h'4 h'4 h'8 h'8 |
    h'4 h'4 a'8 g'8 | 
    e'8 g'8 g'4 g'8 a'8 | 
    a'4 r4 r4 | 
    h'4 h'4 h'8 h'8 | 
    h'4 h'4 a'8 g'8 | 
    e'8 g'8 g'8 a'8 a'8 a'8 | 
    g'4 r4 r4 \\bar "|."
        `,
            // kas annab näidata ainult rütmi? teistsugune noodipea?
            show: `
            \\clef "treble" \\key g \\major \\time 3/4 
    h'4 h'4 h'8 h'8 
            `,
        },
		
		
 
	{ category: "classical_level1", title: "3", soundFile: "../sounds/dictations/classical/level1/3_classical_level1.mp3",
            credits: "Cyrillus Kreek / rahvakoraal \"Mu süda, ärka üles\"",
            notation:
                `
         \\clef treble \\key d \\major \\time 4/4 
    d'8  fis'8 | 
    e'4 d'8 cis'16 h16 h8 d'8 d'8 h8 | 
    a8 e'8 d'2 d'8 fis'8 | 
    e'4 d'8 cis'16 h16 h8 d'8 d'8 h8 | 
    a8 e'8 d'2 fis'4 | 
    e'4 e'8 cis'8 d'4 fis'8 e'8 | 
    g'8 fis'8 e'4. cis'8 d'8 fis'8 | 
    e'4 d'8 cis'16 h16 h8 d'8 d'8 h8 | 
    a8 e'8 d'2  \\bar "|."
        `,
            show: `
            \\clef treble \\key d \\major \\time 4/4 
    d'8  fis'8 |
            `,
	},
	
	{ category: "classical_level1", title: "4", soundFile: "../sounds/dictations/classical/level1/4_classical_level1.mp3",
            credits: "Beethoven -  9.sümfoonia. Finaal",
            notation:
                `
         \\clef "treble" \\key d \\major \\time 4/4 
    fis''4  fis''4 g''4 a''4 | 
    a''4 g''4 fis''4 e''4 | 
    d''4 d''4 e''4 fis''4 | 
    fis''4. e''8 e''2 | 
    fis''4 fis''4 g''4 a''4 | 
    a''4 g''4 fis''4 e''4 | 
    d''4 d''4 e''4 fis''4 | 
    e''4. d''8 d''2 | 
    e''2 fis''4 d''4 | 
    e''4 fis''8 g''8 fis''4 d''4 | 
    e''4 fis''8 g''8 fis''4 e''4 | 
    d''4 e''4 a'4 r4 \\bar "|."
        `,
            show: `
            \\clef "treble" \\key d \\major \\time 4/4 
    fis''4  fis''4 g''4 a''4 |
            `,
	},
	
	{ category: "classical_level1", title: "5", soundFile: "../sounds/dictations/classical/level1/5_classical_level1.mp3",
            credits: "Veljo Tormis \"Kui Arno isaga koolimajja jõudis\" (filmist \"Kevade\")",
            notation:
                `
         \\clef "treble" \\key g \\major \\time 2/4
         d'''2~ | 
    d'''4 d'''4~ | 
    d'''4 d'''4~ | 
    d'''8 d'''8 d'''8 d'''8 | 
    d'''8 c'''8 h''8 a''8 | 
    \\time 3/4  d'''8 h''8 c'''8 d'''16 c'''16 h''8 a''8 | 
    \\time 2/4  h''8 g''8 a''8 a''8 | 
    h''8 a''16 g''16 fis''8 d''8 | 
    g''8 g''8 a''8 c'''8 | 
    h''8 g''8 d''4 \\bar "|."
        `,
            show: `
            d'''2~ | 
    d'''4 d'''4~ | 
    d'''4 d'''4~ | 
    d'''8 d'''8 d'''8 d'''8 | 
    d'''8 c'''8
            `,
	},
	
	{ category: "classical_level1", title: "6", soundFile: "../sounds/dictations/classical/level1/6_classical_level1.mp3",
            credits: "Cyrillus Kreek Reekviem IV osa",
            notation:
                `
         \\clef "bass" \\key c \\major \\time 3/4 
    a,4.  h,8
    a,4 |
    c2 a,4 | 
    d4. h,8 a,8 a,8 | 
    d8 h,8 a,8 a,8 g,8 h,8 | 
    a,4 a,2 \\bar "|."
        `,
            show: `
            \\clef "bass" \\key c \\major \\time 3/4 
    a,4.
            `,
	},
	
	{ category: "classical_level1", title: "X", soundFile: "../sounds/dictations/classical/level1/X_classical_level1.mp3",
            credits: "",
            notation:
                `
         
        `,
            show: `
            
            `,
	},
	
	{ category: "classical_level1", title: "X", soundFile: "../sounds/dictations/classical/level1/X_classical_level1.mp3",
            credits: "",
            notation:
                `
         
        `,
            show: `
            
            `,
	},
	
	{ category: "classical_level1", title: "X", soundFile: "../sounds/dictations/classical/level1/X_classical_level1.mp3",
            credits: "",
            notation:
                `
         
        `,
            show: `
            
            `,
	},
	
	{ category: "classical_level1", title: "X", soundFile: "../sounds/dictations/classical/level1/X_classical_level1.mp3",
            credits: "",
            notation:
                `
         
        `,
            show: `
            
            `,
	},
	
	{ category: "classical_level1", title: "X", soundFile: "../sounds/dictations/classical/level1/X_classical_level1.mp3",
            credits: "",
            notation:
                `
         
        `,
            show: `
            
            `,
	},
		
		
		
		
 ]
