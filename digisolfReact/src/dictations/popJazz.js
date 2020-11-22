

 export const dictations = [
 
	{
	 category: "RM_simple", title: "Smilers", soundFile: "../sounds/dictations/Smilers.mp3",
            credits: "Hendriks Sal-Saller \"Käime katuseid mööda\"",
            notation:
                `
                \\time 4/4 \\key g \major
                r8 h16 h  h a g a~  a8 h r4 |
                r8 h16 h  h16 h h8 d'16 d'8 d'16~ d'16 d e8~ |
                e4 r4 r r \\bar "|."  
        `,
            chords: [
                {bar: 1, beat: 1, chord: "G"},
                {bar: 3, beat: 1, chord: "C"}
            ],
            melody: ",33,3212_,23/33,333,555_,556_/1,,,", // miks lõpus 1, pekas ju 6 olema
            rhythm: "34,1234_,13,/34,123,124_,123_/1,,,/"

        },
 
 ]
