// Notation in Lilypond syntax. For now absolute pitches.
// NB! German notenames (a, b, h, c, cis, cisis) required!
// Use | for barlines.

export const dictations = [
		
// kuidas teha show väljaga? kui pole midagi, siis näita esimest nooti.		
// lihtsad 11-20 viiul
		
		{ category: "1voice_level1", title: "11", soundFile: "../sounds/dictations/1voice/level1/11_1voice_level1.mp3", notation:
                `
              \\time 2/4  
    a4  h4 | 
    c'4 e'4 | 
    a'8 gis'8 a'8 h'8 | 
    e'4 r4 \\bar "|."  
                   
        `
        },
		
		{ category: "1voice_level1", title: "12", soundFile: "../sounds/dictations/1voice/level1/12_1voice_level1.mp3", notation:
                `
                \\time 2/4 
    a'8 h'8 c''4 | 
    c''8 h'8 a'4 | 
    e''8 d''8 c''8 a'8 | 
    h'4 r4 \\bar "|."
                   
        `
        },
		
		{ category: "1voice_level1", title: "13", soundFile: "../sounds/dictations/1voice/level1/13_1voice_level1.mp3", notation:
                `
            \\time 3/4  
    a'8 h'8 h'8 c''8 c''8 h'8 |
    a'8 h'8 h'8 a'8 a'8 e'8 | 
    a'8 h'8 c''4 r4 | 
    h'8 c''8 a'4 r4 \\bar "|."    
                   
        `
        },
		
		{ category: "1voice_level1", title: "14", soundFile: "../sounds/dictations/1voice/level1/14_1voice_level1.mp3", notation:
                `
            \\time 2/4  
    a'8 a'8 r8 a'8 | 
    a'8 a'8 r8 a'8 | 
    h'8 h'8 r8 e'8 | 
    e'8 a'8 r8 a'8 \\bar "|."
                   
        `
        },
		
		{ category: "1voice_level1", title: "15", soundFile: "../sounds/dictations/1voice/level1/15_1voice_level1.mp3", notation:
                `
          \\time 4/4 
    e'4 d'4 c'2 | 
    g'4 f'4 e'2 | 
    c''4 h'4 c''4 d''4 | 
    c''2 g'2 \\bar "|."         
        `
        },
		
		{ category: "1voice_level1", title: "16", soundFile: "../sounds/dictations/1voice/level1/16_1voice_level1.mp3", notation:
                `
                   \\time 2/4 
    c''8  d''8 e''8 d''8 | 
    e''8 f''8 g''4 | 
    c''8 c''8 g'4 | 
    c''8 d''8 g''4 \\bar "|."
        `
        },
		
		{ category: "1voice_level1", title: "17", soundFile: "../sounds/dictations/1voice/level1/17_1voice_level1.mp3", notation:
                `
    \\time 2/4  
    a'4  g'4 | 
    f'4 e'4 | 
    fis'8 e'8 fis'8 gis'8 | 
    a'8 h'8 c''4 \\bar "|."
        `
        },
		
		{ category: "1voice_level1", title: "18", soundFile: "../sounds/dictations/1voice/level1/18_1voice_level1.mp3", notation:
                `
            \\time 2/4  
    h'8  c''8 a'4 |
    a'8 h'8 e'4 | 
    a'8 g'8 f'8 d'8 | 
    e'8 f'8 e'4 \\bar "|."       
        `
        },
		
		{ category: "1voice_level1", title: "19", soundFile: "../sounds/dictations/1voice/level1/19_1voice_level1.mp3", notation:
                `
			\\time 2/4 
    g'4  c''4 | 
    c''4 g''4 | 
    c''8 d''8 d''8 g''8 | 
    g'2 \\bar "|."
        `
        },
		
		{ category: "1voice_level1", title: "20", soundFile: "../sounds/dictations/1voice/level1/20_1voice_level1.mp3", notation:
                `
			\\time 4/4  
    g'8 a'8 h'8 c''8 h'8 c''8 h'8 a'8 | 
    g'8 a'8 h'8 c''8 d''8 e''8 d''8 c''8 | 
    c''8 d''8 e''8 f''8 g''8 a''8 g''4 \\bar "|."
        `
        },
		
        { category: "1voice_level1", title: "21", soundFile: "../sounds/dictations/1voice/level1/21_1voice_level1.mp3", notation:
                `
              \\time 3/4  
    e'4  a'2 | 
    e'4 h'2 | 
    e'4 e''2 |
    e''4 a''2 \\bar "|."     
        `
        },
		
		
		{ category: "1voice_level1", title: "22", soundFile: "../sounds/dictations/1voice/level1/22_1voice_level1.mp3", notation:
                `
             \\time 4/4  
    a'8 h'8 a'8 h'8 c''8 h'8 c''8 h'8 |
    a'8 h'8 c''8 d''8 e''8 f''8 e''8 d''8 | 
    c''8 d''8 c''8 h'8 a'8 h'8 a'8 g'8 | 
    a'4 r4 r4 a'4 \\bar "|."      
        `
        },
		
		{ category: "1voice_level1", title: "23", soundFile: "../sounds/dictations/1voice/level1/23_1voice_level1.mp3", notation:
                `
            \\key g \\major \\time 2/4 
    g'8 a'8 h'4 | 
    a'8 h'8 c''4 |
    h'8 c''8 d''8 e''8 | 
    d''4 d'4 \\bar "|."       
        `
        },
		
		{ category: "1voice_level1", title: "24", soundFile: "../sounds/dictations/1voice/level1/24_1voice_level1.mp3", notation:
                `
            \\key g \\major \\time 2/4 
    g'4  g'8. g'16 | 
    d''4 d''8. d''16 | 
    g''8 g''16 g''16 d''8 d''8 | 
    g''8 d''8 g''8 r8 \\bar "|."       
        `
        },
		
		{ category: "1voice_level1", title: "25", soundFile: "../sounds/dictations/1voice/level1/2X_1voice_level25.mp3", notation:
                `
             \\time 2/4  
    e'8  g'8 h'8 c''8 | 
    h'8 g'8 e'4 | 
    r8 e'8 fis'8 g'8 | 
    fis'4 h4 \\bar "|."      
        `
        },  
		
		{ category: "1voice_level1", title: "26", soundFile: "../sounds/dictations/1voice/level1/26_1voice_level1.mp3", notation:
                `
          \\key g \\major \\time 2/4 
    e'8  dis'8 cis'8 h8 | 
    cis'8 dis'8 e'4 | 
    fis'8 g'8 a'4 | 
    fis'8 g'8 e'4 \\bar "|."         
        `
        },
		
		{ category: "1voice_level1", title: "27", soundFile: "../sounds/dictations/1voice/level1/27_1voice_level1.mp3", notation:
                `
            \\key f \\major \\time 3/4 
    c'4  f'4 f'4 
    g'4 f'4 f'4 | 
    a'8 b'8 c''8 d''8 c''8 b'8 | 
    c''8 g'8 c''4 r4 \bar "|."       
        `
        },
		
		{ category: "1voice_level1", title: "28", soundFile: "../sounds/dictations/1voice/level1/28_1voice_level1.mp3", notation:
                `
            \\key f \\major \\time 4/4 
    c''8  b'8 a'8 g'8 f'4 f'4 | 
    g'8 f'8 e'8 d'8 c'4 c'4 | 
    f'4 f'4 r4 g'4 | 
    f'4 d''4 c''2 \\bar "|."       
        `
        },
		
		{ category: "1voice_level1", title: "29", soundFile: "../sounds/dictations/1voice/level1/29_1voice_level1.mp3", notation:
                `
            \\time 3/4  
    f'8  f'8 e'8 f'8 d'4 | 
    g'8 g'8 f'8 g'8 e'4 | 
    a8 b8 a8 g8 a4 | 
    r4 c'8 d'8 d'4 \\bar "|."       
        `
        },
		
		
		{ category: "1voice_level1", title: "2X", soundFile: "../sounds/dictations/1voice/level1/2X_1voice_level1.mp3", notation:
                `
                   
        `
        },
		
		{ category: "1voice_level1", title: "2X", soundFile: "../sounds/dictations/1voice/level1/2X_1voice_level1.mp3", notation:
                `
                   
        `
        },
		
		
		
		
		
		
		
		
        
        
];
