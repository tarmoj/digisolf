// Notation in Lilypond syntax. For now absolute pitches.
// NB! German notenames (a, b, h, c, cis, cisis) required!
// Use | for barlines.

export const dictations = [
		{category: "1voice_level1", title: "1a",
            soundFile: "../sounds/dictations/1a.mp3",
            notation:
        ` \\time 4/4 
        c d c e | c g e r \\bar "|."
        `
        },
        {   category: "1voice_level1",
            title: "2a", soundFile: "../sounds/dictations/2a.mp3", notation: // url was: ../digisolf/sounds/
                `
                \\time 4/4
                c e g c | h, c g, r \\bar "|."  
        `
        },
        { category: "1voice_level1", title: "3c", soundFile: "../sounds/dictations//3c.mp3", notation:
                `
                \\time 4/4
                c' e' d' c' | g f e  r \\bar "|."  
        `
        },
        { category: "1voice_level1", title: "4b", soundFile: "../sounds/dictations/4b.mp3", notation:
                `  
                \\time 4/4
                a, h, c e | f a gis r \\bar "|."
        `
        },
        { category: "1voice_level1", title: "5a", soundFile: "../sounds/dictations/5a.mp3", notation:
                `
                \\time 4/4
                a, c e gis, | h, e  a, r \\bar "|."  
        `
        },

        { category: "1voice_level1", title: "14a", soundFile: "../sounds/dictations/14a.mp3", notation:
                `
                \\time 3/4
                a,8 h, c c h, c | a,4 a, r | a,8 g, c h, c d | e4 e r \\bar "|."   
        `
        },

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
    e'8 a'8 r8 a'8 \bar "|."
                   
        `
        },
		
        
        
        
];
