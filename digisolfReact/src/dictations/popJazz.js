

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
            melody: ",33,3212_,23/33,333,555_,556_/1,,,", // miks lõpus 1, pekas ju 6 olema
            rhythm: "34,1234_,13,/34,123,124_,123_/1,,,/"

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
     chords: [
     {},
     {}
    ],

 },


 
 ]
