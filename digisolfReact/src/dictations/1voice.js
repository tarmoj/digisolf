// Notation in Lilypond syntax. For now absolute pitches.
// NB! German notenames (a, b, h, c, cis, cisis) required!
// Use | for barlines.

export const dictations = [
// NB! perhaps temporary -  now when askdictation may have extra parameter like askidictaion/1voice/11 -  the path should have // in the beginning
 // soundFiles must be in public folder. use here as relative to that

// lihtsad 1-10 voice
    { category: "1voice_level1", title: "1", soundFile: "/sounds/dictations/1voice/level1/1_1voice_level1.mp3", notation:
            `
          \\clef "treble" \\key c \\major \\time 2/4  
    c'4 c'8 d'8 | 
    e'4 e'8 f'8 | 
    g'8 a'8 g'8 f'8 | 
    g'4 g'4 \\bar "|."     
                   
        `,

    },
    { category: "1voice_level1", title: "2", soundFile: "/sounds/dictations/1voice/level1/2_1voice_level1.mp3", notation:
            `
          \\time 2/4  
    c'4  d'4 | 
    e'8 f'8 g'4 | 
    c'8 d'8 c'8 g8 | 
    c'4 r4 \\bar "|."     
                   
        `,

    },
    { category: "1voice_level1", title: "3", soundFile: "/sounds/dictations/1voice/level1/3_1voice_level1.mp3", notation:
            `
           \\time 3/4  
    c'4  d'4 e'4 | 
    d'4 e'4 f'4 | 
    g'8 a'8 g'8 f'8 g'8 a'8 | 
    g'4 r4 r4 \\bar "|."    
                   
        `,

    },
    { category: "1voice_level1", title: "4", soundFile: "/sounds/dictations/1voice/level1/4_1voice_level1.mp3", notation:
            `
           \\time 3/4   
    c'2  c'4 | 
    e'2 e'4 | 
    g'4 c''4 h'4 | 
    h'4 c''4 r4 \\bar "|."    
                   
        `,

    },
    { category: "1voice_level1", title: "5", soundFile: "/sounds/dictations/1voice/level1/5_1voice_level1.mp3", notation:
            `
           \\time 3/4  
    c''4  h'4 a'4 | 
    g'4 c''4 r4 | 
    g'4 f'4 e'4 | 
    e'4 d'4 r4 \\bar "|."    
                   
        `,

    },
    { category: "1voice_level1", title: "6", soundFile: "/sounds/dictations/1voice/level1/6_1voice_level1.mp3", notation:
            `
           \\time 2/4  
    c'8  h8 c'8 d'8 | 
    e'4 e'4 | 
    e'8 f'8 g'8 a'8 | 
    g'4 r4 \\bar "|."    
                   
        `,

    },
    { category: "1voice_level1", title: "7", soundFile: "/sounds/dictations/1voice/level1/7_1voice_level1.mp3", notation:
            `
           \\time 3/4  
    c'8  d'8 e'8 f'8 g'8 a'8 | 
    g'4 c''4 r4 | 
    c''8 h'8 c''8 h'8 a'8 h'8 | 
    g'4 r4 g'4 \\bar "|."    
                   
        `,

    },
    { category: "1voice_level1", title: "8", soundFile: "/sounds/dictations/1voice/level1/8_1voice_level1.mp3", notation:
            `
            \\time 2/4  
    c''8  d''8 d''8 c''8 | 
    g'4 g'4 | 
    c''8 d''8 d''8 c''8 | 
    g''4 g''4 \\bar "|."   
                   
        `,

    },
    { category: "1voice_level1", title: "9", soundFile: "/sounds/dictations/1voice/level1/9_1voice_level1.mp3", notation:
            `
            \\time 2/4  
    c'16  h16 c'16 h16 c'8 c'8 | 
    c'16 d'16 e'16 f'16 g'8 g'8 | 
    g'16 a'16 g'16 f'16 g'8 c''8 | 
    r4 c'4 \\bar "|."   
                   
        `,

    },
    { category: "1voice_level1", title: "10", soundFile: "/sounds/dictations/1voice/level1/10_1voice_level1.mp3", notation:
            `
           \\time 3/4  
    c'4  c'4 r4 | 
    g'4 g'4 r4 | 
    c''4 g''4 r4 |
    c''4 g'4 r4 \\bar "|."    
                   
        `,

    },
		
// lihtsad 11-20 viiul
		
		{ category: "1voice_level1", title: "11", soundFile: "/sounds/dictations/1voice/level1/11_1voice_level1.mp3", notation:
                `
              \\time 2/4  
    a4  h4 | 
    c'4 e'4 | 
    a'8 gis'8 a'8 h'8 | 
    e'4 r4 \\bar "|."  
                   
        `,
            show: `\\time 2/4  a4`
        },
		
		{ category: "1voice_level1", title: "12", soundFile: "/sounds/dictations/1voice/level1/12_1voice_level1.mp3", notation:
                `
                \\time 2/4 
    a'8 h'8 c''4 | 
    c''8 h'8 a'4 | 
    e''8 d''8 c''8 a'8 | 
    h'4 r4 \\bar "|."
                   
        `,
            show: `\\time 2/4 a'8`
        },
		
		{ category: "1voice_level1", title: "13", soundFile: "/sounds/dictations/1voice/level1/13_1voice_level1.mp3", notation:
                `
            \\time 3/4  
    a'8 h'8 h'8 c''8 c''8 h'8 |
    a'8 h'8 h'8 a'8 a'8 e'8 | 
    a'8 h'8 c''4 r4 | 
    h'8 c''8 a'4 r4 \\bar "|."    
                   
        `,
            show: `\\time 3/4  
    a'8`
        },
		
		{ category: "1voice_level1", title: "14", soundFile: "/sounds/dictations/1voice/level1/14_1voice_level1.mp3", notation:
                `
            \\time 2/4  
    a'8 a'8 r8 a'8 | 
    a'8 a'8 r8 a'8 | 
    h'8 h'8 r8 e'8 | 
    e'8 a'8 r8 a'8 \\bar "|."
                   
        `,
            show: `\\time 2/4  
    a'8`
        },
		
		{ category: "1voice_level1", title: "15", soundFile: "/sounds/dictations/1voice/level1/15_1voice_level1.mp3", notation:
                `
          \\time 4/4 
    e'4 d'4 c'2 | 
    g'4 f'4 e'2 | 
    c''4 h'4 c''4 d''4 | 
    c''2 g'2 \\bar "|."         
        `
        },
		
		{ category: "1voice_level1", title: "16", soundFile: "/sounds/dictations/1voice/level1/16_1voice_level1.mp3", notation:
                `
                   \\time 2/4 
    c''8  d''8 e''8 d''8 | 
    e''8 f''8 g''4 | 
    c''8 c''8 g'4 | 
    c''8 d''8 g''4 \\bar "|."
        `
        },
		
		{ category: "1voice_level1", title: "17", soundFile: "/sounds/dictations/1voice/level1/17_1voice_level1.mp3", notation:
                `
    \\time 2/4  
    a'4  g'4 | 
    f'4 e'4 | 
    fis'8 e'8 fis'8 gis'8 | 
    a'8 h'8 c''4 \\bar "|."
        `
        },
		
		{ category: "1voice_level1", title: "18", soundFile: "/sounds/dictations/1voice/level1/18_1voice_level1.mp3", notation:
                `
            \\time 2/4  
    h'8  c''8 a'4 |
    a'8 h'8 e'4 | 
    a'8 g'8 f'8 d'8 | 
    e'8 f'8 e'4 \\bar "|."       
        `
        },
		
		{ category: "1voice_level1", title: "19", soundFile: "/sounds/dictations/1voice/level1/19_1voice_level1.mp3", notation:
                `
			\\time 2/4 
    g'4  c''4 | 
    c''4 g''4 | 
    c''8 d''8 d''8 g''8 | 
    g'2 \\bar "|."
        `
        },
		
		{ category: "1voice_level1", title: "20", soundFile: "/sounds/dictations/1voice/level1/20_1voice_level1.mp3", notation:
                `
			\\time 4/4  
    g'8 a'8 h'8 c''8 h'8 c''8 h'8 a'8 | 
    g'8 a'8 h'8 c''8 d''8 e''8 d''8 c''8 | 
    c''8 d''8 e''8 f''8 g''8 a''8 g''4 \\bar "|."
        `
        },
		
        { category: "1voice_level1", title: "21", soundFile: "/sounds/dictations/1voice/level1/21_1voice_level1.mp3", notation:
                `
              \\time 3/4  
    e'4  a'2 | 
    e'4 h'2 | 
    e'4 e''2 |
    e''4 a''2 \\bar "|."     
        `
        },
		
		
		{ category: "1voice_level1", title: "22", soundFile: "/sounds/dictations/1voice/level1/22_1voice_level1.mp3", notation:
                `
             \\time 4/4  
    a'8 h'8 a'8 h'8 c''8 h'8 c''8 h'8 |
    a'8 h'8 c''8 d''8 e''8 f''8 e''8 d''8 | 
    c''8 d''8 c''8 h'8 a'8 h'8 a'8 g'8 | 
    a'4 r4 r4 a'4 \\bar "|."      
        `
        },
		
		{ category: "1voice_level1", title: "23", soundFile: "/sounds/dictations/1voice/level1/23_1voice_level1.mp3", notation:
                `
            \\key g \\major \\time 2/4 
    g'8 a'8 h'4 | 
    a'8 h'8 c''4 |
    h'8 c''8 d''8 e''8 | 
    d''4 d'4 \\bar "|."       
        `
        },
		
		{ category: "1voice_level1", title: "24", soundFile: "/sounds/dictations/1voice/level1/24_1voice_level1.mp3", notation:
                `
            \\key g \\major \\time 2/4 
    g'4  g'8. g'16 | 
    d''4 d''8. d''16 | 
    g''8 g''16 g''16 d''8 d''8 | 
    g''8 d''8 g''8 r8 \\bar "|."       
        `
        },
		
		{ category: "1voice_level1", title: "25", soundFile: "/sounds/dictations/1voice/level1/25_1voice_level1.mp3", notation:
                `
     \\key e \\minor  \\time 2/4  
    e'8  g'8 h'8 c''8 | 
    h'8 g'8 e'4 | 
    r8 e'8 fis'8 g'8 | 
    fis'4 h4 \\bar "|."      
        `
        },  
		
		{ category: "1voice_level1", title: "26", soundFile: "/sounds/dictations/1voice/level1/26_1voice_level1.mp3", notation:
                `
          \\key g \\major \\time 2/4 
    e'8  dis'8 cis'8 h8 | 
    cis'8 dis'8 e'4 | 
    fis'8 g'8 a'4 | 
    fis'8 g'8 e'4 \\bar "|."         
        `
        },
		
		{ category: "1voice_level1", title: "27", soundFile: "/sounds/dictations/1voice/level1/27_1voice_level1.mp3", notation:
                `
            \\key f \\major \\time 3/4 
    c'4  f'4 f'4 |
    g'4 f'4 f'4 | 
    a'8 b'8 c''8 d''8 c''8 b'8 | 
    c''8 g'8 c''4 r4 \\bar "|."       
        `
        },
		
		{ category: "1voice_level1", title: "28", soundFile: "/sounds/dictations/1voice/level1/28_1voice_level1.mp3", notation:
                `
            \\key f \\major \\time 4/4 
    c''8  b'8 a'8 g'8 f'4 f'4 | 
    g'8 f'8 e'8 d'8 c'4 c'4 | 
    f'4 f'4 r4 g'4 | 
    f'4 d''4 c''2 \\bar "|."       
        `
        },
		
		{ category: "1voice_level1", title: "29", soundFile: "/sounds/dictations/1voice/level1/29_1voice_level1.mp3", notation:
                `
    \key f \\major \\time 3/4  
    f''8  f''8 e''8 f''8 d''4 | 
    g''8 g''8 f''8 g''8 e''4 | 
    a'8 b'8 a'8 g'8 a'4 | 
    r4 c''8 d''8 d''4 \\bar "|."       
        `
        },
		
		
		{ category: "1voice_level1", title: "30", soundFile: "/sounds/dictations/1voice/level1/30_1voice_level1.mp3", notation:
                `
          \\key f \\major \\time 3/4 d'4 a'2 | 
    b'4 cis'2 | 
    d'8 e'8 f'8 g'8 a'8 b'8 | 
    d''4 cis''2 \\bar "|."         
        `
        },

// guitar 31-40
    { category: "1voice_level1", title: "31", soundFile: "/sounds/dictations/1voice/level1/31_1voice_level1.mp3", notation:
            `
        \\key g \\major \\time 4/4 
       g'4 g'8 g'16 g'16 g'4 d'4 | 
    h'4 h'8 h'16 h'16 h'4 g'8 h'8 | 
    d''8 d''16 d''16 d'8. d'16 g'4 g''4 \\bar "|."        
        `
    },

    { category: "1voice_level1", title: "32", soundFile: "/sounds/dictations/1voice/level1/32_1voice_level1.mp3", notation:
            `
             \\key g \\major \\time 3/4  
    g'8  h'8 d''8 c''8 d''8 e''8 | 
    d''8 c''8 a'4 a'4 | 
    d''8 c''8 fis'4 fis'4 | 
    d''8 h'8 g'4 g'4 \\bar "|."  
        `
    },

    { category: "1voice_level1", title: "33", soundFile: "/sounds/dictations/1voice/level1/33_1voice_level1.mp3", notation:
            `
         \\time 2/4   
    h8  | 
    e'8 e'8 r8 h8 | 
    fis'8 fis'8 r8 h8 | 
    h'8 h'8 r8 h'8 | 
    e''8 e''8 r8  \\bar "|."      
        `,

     show: `\\time 2/4  h8  |`
    },


    { category: "1voice_level1", title: "34", soundFile: "/sounds/dictations/1voice/level1/34_1voice_level1.mp3", notation:
            `
          \\key g \\major \\time 2/4 
    h'16  a'16 g'16 fis'16 a'16 g'16 fis'16 d'16 | 
    e'8 e'8 r4 | 
    d'16 e'16 fis'16 g'16 a'8 a'8 | 
    r2 | 
    e'16 fis'16 g'16 a'16 h'8 h'8 | 
    r2 \\bar "|."     
        `
    },

    // triool
/*
    { category: "1voice_level1", title: "35", soundFile: "/sounds/dictations/1voice/level1/35_1voice_level1.mp3", notation:
            `
            \\key f \\major \\time 2/4  
    f'8.  g'16 f'8. g'16 | 
    a'8. g'16 a'8. b'16 | 
    c''8 c''8 
    \\tuplet 3/2 { c''8 d''8 c''8 }     | 
    f''8 f''8 r8 f'8 \\bar "|."   
        `
    },
*/
    { category: "1voice_level1", title: "36", soundFile: "/sounds/dictations/1voice/level1/36_1voice_level1.mp3", notation:
            `
              \\key f \\major \\time 2/4  
    c''16 b'16 a'16 b'16 c''8 f''8 | 
    f'16 e'16 f'16 g'16 a'8 d''8 | 
    c''4 r8 d''8 | 
    c''4 r8 c''8 | 
    c'4 r8 c''8 | 
    f'4 r4 \\bar "|." 
        `
    },

    { category: "1voice_level1", title: "37", soundFile: "/sounds/dictations/1voice/level1/37_1voice_level1.mp3", notation:
            `
            \\time 3/4  
    d''8  cis''8 h'8 a'8 h'8 cis''8 | 
    d''8 e''8 f''4 r4 | 
    e''8 d''8 e''4 r4 | 
    d''8 c''8 a'4 r4  \\bar "|."   
        `
    },

    { category: "1voice_level1", title: "38", soundFile: "/sounds/dictations/1voice/level1/38_1voice_level1.mp3", notation:
            `
         \\key f \\major \\time 2/4 d'4 f'8 a'8  
    d'4 g'8 b'8 | 
    d'4 a'8 cis''8 | 
    d''8 e''8 f''4 \\bar "|."      
        `
    },
// triool
    /*
    { category: "1voice_level1", title: "39", soundFile: "/sounds/dictations/1voice/level1/39_1voice_level1.mp3", notation:
            `
          \\key d \\major \\time 4/4  
    fis'8  g'8 | 
    a'4 d''4 e''4 a'4 | 
    fis''8 g''8 a''4 r4 g''8 fis''8 | 
    e''16 fis''16 e''16 fis''16 e''4 r4 a'8 g'8 | 
    
    \\tuplet 3/2  {fis'8 g'8 fis'8 }    e'4 r4 \\bar "|."
        `,
        show: ` \\key d \\major \\time 4/4  
    fis'8  g'8 | `
    },
*/
    { category: "1voice_level1", title: "40", soundFile: "/sounds/dictations/1voice/level1/40_1voice_level1.mp3", notation:
            `
          \\key d \\major \\time 2/4  
    d''8 d''8 r8 d''8 | 
    r8 a'8 a'8 r8 | 
    r8 a''8 r8 a''8 | 
    e''16 fis''16 e''8 r4 \\bar "|."     
        `
    },

   

// flööt 41-50		
		
		{ category: "1voice_level1", title: "41", soundFile: "/sounds/dictations/1voice/level1/41_1voice_level1.mp3", notation:
                `
        \\key h \\minor   \\time 2/4  
    h'16  cis''16 h'16 cis''16 d''16 e''16 d''16 e''16 |
    fis''4 r4 | 
    fis''16 g''16 fis''16 g''16 a''16 g''16 fis''16 e''16 |
    fis''4 r4 \\bar "|."        
        `
        },
		
		{ category: "1voice_level1", title: "42", soundFile: "/sounds/dictations/1voice/level1/42_1voice_level1.mp3", notation:
                `
             \\key d \\major \\time 3/4
    d''8 cis''8 h'4 a'4 | 
    g'4 r4 r4 | 
    fis'8 g'8 a'8 g'8 fis'8 e'8 | 
    fis'4 r4 r4 \\bar "|."   
        `
        },
		
		{ category: "1voice_level1", title: "43", soundFile: "/sounds/dictations/1voice/level1/43_1voice_level1.mp3", notation:
                `
        
        \\key B \\major \\time 3/4 
    b'8 d''8 f''8 d''8 f''8 d''8 | 
    b'4 b'4 r4 | 
    c''8 a'8 f'8 a'8 c''4 | 
    d''8 b'8 f'8 b'8 d''4 | 
    r4 es''8 d''8 c''8 b'8 |
    a'8 g'8 f'4 r4  \\bar "|."    
        `
        },
		
		{ category: "1voice_level1", title: "44", soundFile: "/sounds/dictations/1voice/level1/44_1voice_level1.mp3", notation:
                `
           \\key b \\major \\time 2/4 f'4 b'4 |
    c''4 f''4 | 
    d''4 c''8. b'16 | 
    c''4 f'4 \\bar "|."     
        `
        },
		
		{ category: "1voice_level1", title: "45", soundFile: "/sounds/dictations/1voice/level1/45_1voice_level1.mp3", notation:
                `
          \\key b \\major \\time 4/4  
    b'4  a'4 g'8 f'8 g'4 | 
    d'8 es'8 f'4 es'8 f'8 g'4 | 
    b'8 a'8 g'8 f'8 g'4 r4 \\bar "|."
        `
        },
		
		{ category: "1voice_level1", title: "46", soundFile: "/sounds/dictations/1voice/level1/46_1voice_level1.mp3", notation:
                `
             \\key b \\major \\time 2/4
    g'16  b'16 d''8 g'16 c''16 es''8 |
    g'16 a'16 b'16 c''16 d''8 d''8 | 
    c''16 es''16 g''8 a''16 f''16 d''16 c''16 | 
    d''8 d''8 r8 d'''8 \\bar "|."   
        `
        },
		
		{ category: "1voice_level1", title: "47", soundFile: "/sounds/dictations/1voice/level1/47_1voice_level1.mp3", notation:
                `
                \\key g \\major \\time 4/4 
    d''4  h'8. c''16 d''4 g'4 | 
    e''16 d''16 c''16 d''16 e''8 fis''8 g''4 g'4 | 
    c''4 c''4 r4 d''16 c''16 h'16 a'16 | 
    h'4 h'4 r4 c''16 h'16 a'16 g'16 | 
    d'4 d'4 r4 c''16 h'16 a'16 g'16 | 
    a'4 r4 r2 \\bar "|."
        `
        },
		
		{ category: "1voice_level1", title: "48", soundFile: "/sounds/dictations/1voice/level1/48_1voice_level1.mp3", notation:
                `
     \\key e \\minor \\time 2/4  
    e'8 h'8 h'8 h'8 | 
    e'8 c''8 c''8 c''8 | 
    r8 e'8 h'8 a'16 g'16 | 
    a'16 g'16 fis'8 r8 fis'16 g'16 | 
    e'8 h'8 h'8 h'8 | 
    h'8 e''8 e''8 fis''8 \\bar "|."  
        `
        },
		
		{ category: "1voice_level1", title: "49", soundFile: "/sounds/dictations/1voice/level1/49_1voice_level1.mp3", notation:
                `
                \\key f \\major \\time 3/4 
    c''8 d''8 e''8 f''8 g''8 a''8 | 
    f''4 c''4 r4 | 
    c''8 d''8 e''8 f''8 g''8 a''8 | 
    b''4 c''4 r4 | 
    r4 d''8 e''8 f''8 g''8 | 
    a''4 c'''4 r4 \\bar "|."
        `
        },
		
		{ category: "1voice_level1", title: "50", soundFile: "/sounds/dictations/1voice/level1/50_1voice_level1.mp3", notation:
                `
       \\key f \\major \\time 4/4  
    d'8  f'8  | 
    a'4 a'4 a'4 g'8 f'8 | 
    e'4 d'4 d'4 a'8 d''8 | 
    e''4 a'4 a'4 a'8 e''8 | 
    f''8 e''8 d''8 c''8 d''4 d'8 f'8 | 
    a'4 a'4 a'4 \\bar "|."   
        `
        }
		
		
        
        
];
