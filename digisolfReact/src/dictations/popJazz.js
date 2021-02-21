

 export const dictations = [
 
	{
	 category: "popJazz", title: "Smilers", soundFile: "/sounds/dictations/Smilers.mp3",
            credits: "Hendrik Sal-Saller \"Käime katuseid mööda\"",
            notation:
                `
                \\time 4/4 \\key g \major
                r8 h'16 h'  h' a' g' a'~  a'8 h' r4 |
                r8 h'16 h'  h'16 h' h'8 d''16 d''8 d''16~ d''16 d' e'8~ |
                e4' r4 r r \\bar "|."  
        `,
            chords: [
                {bar: 1, beat: 1, chord: "G"},
                {bar: 3, beat: 1, chord: "C"}
            ],
    },

     {
     category: "popJazz", title: "Vaikida võib", soundFile: "/sounds/dictations/popJazz/level1/Vaikida_voib.mp3 ",
     credits: "Muusika/sõnad: Ott Lepland, Oliver Rõõmus, Joonatan Siiman 0:46 - 0:50 https://youtu.be/Q46r_SVSIhk?t=46",
     notation:
 `
     \\clef "treble" \\key b \\major \\time 4/4 
    g'8 f'8 g'4 r4. g'8 | 
    g'16 f'8. f'16 d'8. d'16 f'8. f'8 d'8 \\bar "|."            
        `,

    },

     {
         category: "popJazz", title: "Siin me kokku saime", soundFile: "/sounds/dictations/popJazz/level1/Siin-me-kokku-saime.mp3 ",
         credits: "Muusika/sõnad: Ott Lepland 01:00 - 01:06 https://youtu.be/5dKfSe3y6UY",
 // NB! double dot not supported in VexTab changed here to normal dot...
         notation:
             `
            \\clef "treble" \\key des \\major \\time 4/4 r4. r16
    des'16~ des'8 c'8 b8 as8 | 
    b8. b16 r4 b8. b16~ b4 | 
    b8. b16~ b2 r4 \\bar "|."    
        `,
         show: ` \\clef "treble" \\key des \\major \\time 4/4 r4. r16
    des'16~ des'8`,

/*         \chordmode {
    // siit algusest vist Bbm puudu
     s16*7 s16 s8 s8 s8 s8 | % 2
     ges8.:5.2 s16 s4 as8.:sus4 s16 s4 | % 3
     b8.:m7 s16 s2 s4 \bar "|."  }*/
     },

     {
         category: "popJazz", title: "Parem veelgi", soundFile: "/sounds/dictations/popJazz/level1/Parem-veelgi-ref.mp3 ",
         credits: "Tanel Padar",
         notation:
             `
            \\clef "treble" \\key es \\major \\time 4/4 
    r2 g8 c'8 es'8 g'8 | 
    es'4 c'4 as4 f'8. d'16~ | 
    d'2 r2 | 
    d'8 d'16 d'16~ d'8 d'8 es'16 d'8 d'16~ d'8 es'8 \\bar "|."     
        `,
         show: `\\clef "treble" \\key es \\major \\time 4/4 
    r2 g8`,


         /*
          \chordmode {
    | % 1
    c2:m5 s8 s8 s8 s8 | % 2
    as4:5.2 s4 s4 s8. s16 | % 3
    b2:5 s2 | % 4
    s8 s16 s16 s8 s8 g16:m7 s8 s16 s8 s8 \bar "|."
    }
         */


     },

     {
         category: "popJazz", title: "Segased lood", soundFile: "/sounds/dictations/popJazz/level1/Segased-lood-ref.mp3 ",
         credits: "s: T. Padar / m: T. Padar, K. Kalluste, T. Kull youtube: https://youtu.be/ZtfLzUHH93I?t=58 0:58 - 1:04",
         notation:
             `
             \\clef "treble" \\key a \\major \\time 4/4 
    r2 r8 e'16 e'16 e'8 e'8 | 
    e'8 fis'8 a8 a8 e'8 d'8 cis'16 h8 cis'16( | 
    h2) r2 \\bar "|."   
        `,
         show: `\\clef "treble" \\key a \\major \\time 4/4 
    r2 r8 e'16 e'16`,


         /*
\chordmode {
    cis2:m7 s8 s16 s16 s8 s8 | % 2
    d8:5.2 s8 s8 s8 s8 s8 s16 s8 s16 | % 3
    e2:sus4 s2 \bar "|."
          */

     },



     {
         category: "popJazz_level1",
         title: "I - Tuuled tulid",
         soundFile: "/sounds/dictations/popJazz/level1/Tuuled-tulid.mp3 ",
         credits: "s: A. Ilves / m: O. Lepland youtube: https://youtu.be/T7BaTBe0UD8?t=123 2:03-2:17",
         notation:
             `
    \\clef "treble" \\key c \\major \\time 4/4 
    e'8 e'8 e'8 e'8 e'8 f'8 g'8 c'8~ | 
    c'8 r8 c'8 a8 c'8 d'8 e'8 a8 | 
    r4 a8 g8 a8 c'8~ c'8 a8 | 
    a8 g4. r2 \\bar "|."  
        `,


         /*
\chordmode {
    c8:5 s8 s8 s8 s8 s8 s8 s8 | % 2
    a8:m7 s8 s8 s8 s8 s8 s8 s8 | % 3
    f4:5.2 s8 s8 s8 s8 s8 s8 | % 4
    f8:5/+g s4. s2 \bar "|."
    }
          */

     },


 // Level 2 --------------------------------

     {
         category: "popJazz", title: "II Siin me kokku saime", soundFile: "/sounds/dictations/popJazz/level2/Siin-me-kokku-saime-2.mp3 ",
         credits: "Muusika/sõnad: Ott Lepland youtube: https://youtu.be/5dKfSe3y6UY?t=75  1:15 - 1:24",
         // NB! double dot not supported in VexTab changed here to normal dot...
         notation:
             `
            \\clef "treble" \\key b \\minor \\time 4/4 
    r8. b16 des'16 b8 des'16~ des'4 des'16 es'8. |
    c'8 b16 b16~ b16 as16 as8~ as8 r16 f16 as16 f8 as16~ | 
    as8 b8 r4 r16 f'8. es'8 des'16 f'16~ | 
    f'8 f'4. r8 des'4. \\bar "|."    
        `,
         show: ` \\clef "treble" \\key b \\minor \\time 4/4 
    r8. b16 des'16 `,

         /*         \chordmode {
             es8.:m7 s16 s16 s8 s16 s4 s16 s8. | % 2
    as8:5.2 s16 s16 s16 s16 s8 s8 s16 s16 s16 s8 s16 | % 3
    b8:m7 s8 s4 s16 s8. s8 s16 s16 | % 4
    s8 s4. s8 s4. \bar "||"
    }
    */
     },

 // Level 3 ---------------------

     {
         category: "popJazz_level3",
         title: "III - Kuula",
         soundFile: "/sounds/dictations/popJazz/level3/Ott-Lepland-Kuula.mp3 ",
         credits: "m: T. Tennille / s: V. Tamm youtube: https://youtu.be/vVFOoqqmnaY?t=23 0:23 - 0:34",
         notation:
             `
    \\clef "treble" \\key f \\major \\time 4/4
    d'8 c'16 d'16~ d'16 c'16 d'8 r8 c'16 d'16~ d'16 f'16 e'16 e'16~ |
    e'8 c'16 e'16~ e'16 e'16 r8 e'8 e'16 e'16~ e'16 g'8 g'16~ |
    g'1~ |
    g'2. r4 \\bar "|."   
        `,


         /*
\chordmode {
| % 1
    b8:5.2 s16 s16 s16 s16 s8 s8 s16 s16 s16 s16 s16 s16 | % 2
    f8:5.2/+a s16 s16 s16 s16 s8 s8 s16 s16 s16 s8 s16 | % 3
    c1:sus4 | % 4
    c2..:5 s8 \bar "||"
    }
          */

     },




 ]
