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
	
	{ category: "classical_level1", title: "7", soundFile: "../sounds/dictations/classical/level1/7_classical_level1.mp3",
            credits: "Tõnu Kõrvits \"Kreegi vihik\" 8.osa",
            notation:
                `
         \\clef "treble" \\key a \\major \\time 4/4 
    e'4 | 
    a'4 gis'4 a'8 cis''8 cis''4 | 
    cis''8 h'8 h'2 d''4 | 
    cis''8 h'8 h'8 a'8 h'4 a'8 gis'8 |
    a'2 r4 a'4 | 
    e''4 e''8 cis''8 d''4 cis''8 h'8 | 
    h'2 r4 \\bar "|."
        `,
            show: `
            \\clef "treble" \\key a \\major \\time 4/4 
    e'4 | 
            `,
	},
	
	{ category: "classical_level1", title: "8", soundFile: "../sounds/dictations/classical/level1/8_classical_level1.mp3",
            credits: "Cyrillus Kreek - Reekviem VIII osa",
            notation:
                `
         \\clef "treble" \\key es \\major \\time 6/4 
    c'4 d'4 es'4 g'2 f'4 | 
    c'4 d'4 es'4 g'2 f'4 | 
    c'4 g'4 f'4 es'4 d'4 c'4 | 
    es'2. d'2. | 
    c'4 d'4 es'4 g'2 f'4 | 
    c'4 d'4 es'4 g'2 f'4 | 
    es'4 d'4 c'4 b2 d'4 | 
    c'2. c'2. \\bar "|."
        `,
            show: `
            \\clef "treble" \\key es \\major \\time 6/4 
    c'4 d'4 es'4
            `,
	},
	
// NB! Vaja triooli tugi!	
// vextab:  :8  E/4 F/4 G/4  ^3^
// VexFlow? how to do it in notationInfo -  add field tuplet: 3 (as in StaveNote) 
// comment out for now...
/*	
	{ category: "classical_level1", title: "9", soundFile: "../sounds/dictations/classical/level1/9_classical_level1.mp3",
            credits: "Tõnu Kõrvits \"Kreegi vihik\" 1.osa",
            notation:
                `
         \\clef "treble" \\key es \\major \\time 4/4 
    es'8  g'8 | 
    b'4 b'4 b'8 f'8 f'4 | 
    b'4 
    \\tuplet 3/2  {c''8 b'8 c''8 }
    b'4 c''8 b'8 | 
    b'4 g'4 g'8 as'8 
    \\tuplet 3/2 {g'8 f'8 d'8 } | 
    es'4 
    \\tuplet 3/2   {b'8 f'8 g'8 }
    f'4 es'4 \\bar "|."
        `,
            show: `
            \\clef "treble" \\key es \\major \\time 4/4 
    es'8  g'8 | 
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
*/

// triplet again...
// + support for \grace
/*
	{ category: "classical_level1", title: "10 - Noteeri fagoti soolo", soundFile: "../sounds/dictations/classical/level1/10_classical_level1.mp3",
            credits: "Cyrillus Kreek - Reekviem 2.osa",
            notation:
                `
         \\clef "bass" \\key as \\major \\time 2/2
    as4 as8 b8 as8 g8
    f8 es8 | 
    g4 as4 g4 f4 | 
    as8 g8 as8 b8 as8 g8 f8 es8 | 
    g8 es8 as4 g16 as16 g8 f4 | 
    c4. es8 f4 es4 | 
    g8 es8 as4 \grace { g16 as16 } g4 f4 | 
    c4. es8 g8 f8 es4 | 
    f4 
    \\tuplet 3/2  {es8 f8 es8 }
    c2 \\bar "|."
        `,
            show: `
            \\clef "bass" \\key as \\major \\time 2/2
    as4 as8 b8
            `,
	},
*/	

	{ category: "classical_level1", title: "11", soundFile: "../sounds/dictations/classical/level1/11_classical_level1.mp3",
            credits: "Eduard Tubin \"Sabatants\" balletist \"Kratt\"",
            notation:
                `
         \\time 2/4   r4  g''4~ | 
    g''8. c''16 f''8 a''8 | 
    g''16 f''16 d''16 h'16 d''8 c''8 | 
    f''8. c''16 e''8. c''16 | 
    e''8 d''16 h'16 d''8 c''8 | 
    g''8. c''16 f''8 a''8 | 
    g''8. c''16 f''8 e''16 c''16 | 
    g''8. c''16 f''8 e''16 c''16 | 
    e''8 d''16 h'16 d''8 c''8 | 
    f''8. c''16 e''8. c''16 | 
    f''8. c''16 e''8. c''16 | 
    d''8 c''8 d''8 c''8 \\bar "|."
        `,
            show: `
            \\time 2/4   r4  g''4~ | 
    g''8. c''16 f''8 a''8 |
            `,
	},	
		
// jne, lihtsaid kokku 23
	
	
// ================= LEVEL 2 =========================	
	

// NB! Siin ka akordimärgid, aga mõtle veel, kuidas neid vormistada - kas noodi või takti külge vms	
// NB! uus väli "instructions" - tõlge?	
	{ category: "classical_level2", title: "II - 1", soundFile: "../sounds/dictations/classical/level1/1_classical_level2.mp3",
			instructions: "Noteeri meloodia ja bass, tähista harmoonia - D-duur",
            credits: "Margo Kõlar \"Martale\"",
            notation: {
				stave1: `
	\\clef "treble" \\key d \\major \\time 3/4 
    fis''2~ fis''8.
    g''32 fis''32 | 
    e''2 a''4 | 
    d''2 d''4 h'8 a'8 ~ a'2 | 
    fis''2 ~ fis''8. g''32 fis''32 | 
    e''2 a''4 | 
    h''8 d'''8 ~ d'''2 | 
    r4 d''2 \\bar "|."
				
				`,
				stave2: `
	\\clef "treble" \\key d \\major \\time 3/4 
    d'2.  | cis'2. | g2. | e2. | 
    r2 r8 d'8 | 
    a2. |  e2. | g2. \\bar "|."
				`
			},
	show: {
         stave1: `
	\\clef "treble" \\key d \\major \\time 3/4 
    fis''2~ fis''8.
				
				`,
				stave2: `
	\\clef "treble" \\key d \\major \\time 3/4 
    d'2.  | 
				`   
		
	}
	},
		
 ]
