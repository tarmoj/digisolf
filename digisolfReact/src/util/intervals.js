const possibleIntervals = [
    { shortName: "p1", longName: "unison", semitones: 0, degrees: 0 }, // degrees (astmeid) -  difference in scale degrees (Ces/C/Cis - 0,  Des/D/Dis - 1 etc)
    { shortName: "v2", longName: "minor second", semitones: 1, degrees: 1 },
    { shortName: "s2", longName: "major second", semitones: 2, degrees: 1 },
    { shortName: "v3", longName: "minor third", semitones: 3, degrees: 2 },
    { shortName: "s3", longName: "major third", semitones: 4, degrees: 2 },
    { shortName: "p4", longName: "perfect fourth", semitones: 5, degrees: 3 },
    { shortName: ">4", longName: "augmented fourth", semitones: 6, degrees: 3 }, // vähendatud kvint?
    { shortName: "<5", longName: "diminished fifth", semitones: 6, degrees: 4 },
    { shortName: "p5", longName: "perfect fifth", semitones: 7, degrees: 4 },
    { shortName: "v6", longName: "minor sixth", semitones: 8, degrees: 5 },
    { shortName: "s6", longName: "major sixth", semitones: 9, degrees: 5 },
    { shortName: "v7", longName: "minor seventh", semitones: 10, degrees: 6 },
    { shortName: "s7", longName: "major seventh", semitones: 11, degrees: 6 },
    { shortName: "p8", longName: "octave", semitones: 12, degrees:  7 },
];

// TODO: into English! check abbreviations and correct terms
// also shortNames of intervals to English
export const chordDefinitions = [
    { shortName: "M", longName: "mažoorne kolmkõla", intervalsUp: ["s3", "p5"], intervalsDown: ["v3", "p5"],
        midiIntervals: [0, 4, 7] }, // intervals from lower note
    { shortName: "m", longName: "minoorne kolmkõla", intervalsUp: ["v3", "p5"], intervalsDown: ["s3", "p5"],
        midiIntervals: [0, 3, 7] },
    { shortName: "M7", longName: "väike mažoorseptakord", intervalsUp: ["s3", "p5", "v7"],
        intervalsDown: ["v3", "<5", "v7" ], midiIntervals: [0, 4, 7, 10]  },
    { shortName: "<kk", longName: "vähendatud kolmkõla", intervalsUp: ["v3", "<5"], intervalsDown: ["v3", "<5"],
        midiIntervals: [0, 3, 6] },
    { shortName: ">kk", longName: "suurendatud kolmkõla", intervalsUp: ["s3", ">5"], intervalsDown: ["s3", ">5"],
        midiIntervals: [0, 4, 8] }

];

export const getInterval = (note1, note2) => {
    const semitones = note2.midiNote - note1.midiNote;

    let direction;
    if (semitones > 0) {
        direction = "up";
    } else if (semitones === 0) {
        direction = "same";
    } else {
        direction = "down";
    }

    const interval = findIntervalBySemitones(Math.abs(semitones));
    return {note1: note1, note2: note2, interval: interval, direction: direction};
};

const findIntervalBySemitones = (semitones) => {	// Return first interval found
    return possibleIntervals.find(interval => interval.semitones === semitones);
};