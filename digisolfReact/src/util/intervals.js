import * as notes from "./notes"

//TODO: shortNames to English -  check. perhams m, M, d, a ?
// + translations
const intervalDefinitions = [
    { shortName: "p1", inversion: "p8", longName: "unison", semitones: 0, degrees: 0 }, // degrees (astmeid) -  difference in scale degrees (Ces/C/Cis - 0,  Des/D/Dis - 1 etc)
    { shortName: "v2", inversion: "s7",longName: "minor second", semitones: 1, degrees: 1 },
    { shortName: "s2", inversion: "v7",longName: "major second", semitones: 2, degrees: 1 },
    { shortName: "v3", inversion: "s6",longName: "minor third", semitones: 3, degrees: 2 },
    { shortName: "s3", inversion: "v6",longName: "major third", semitones: 4, degrees: 2 },
    { shortName: "p4", inversion: "p5",longName: "perfect fourth", semitones: 5, degrees: 3 },
    { shortName: ">4", inversion: "<5",longName: "augmented fourth", semitones: 6, degrees: 3 },
    { shortName: "<5", inversion: ">4",longName: "diminished fifth", semitones: 6, degrees: 4 }, // TODO: < and > wrong here! Should be the other way round! check!
    { shortName: "p5", inversion: "p4",longName: "perfect fifth", semitones: 7, degrees: 4 },
    { shortName: ">5", inversion: "<4",longName: "augmented fifth", semitones: 8, degrees: 4 },
    { shortName: "v6", inversion: "s3",longName: "minor sixth", semitones: 8, degrees: 5 },
    { shortName: "s6", inversion: "v3",longName: "major sixth", semitones: 9, degrees: 5 },
    { shortName: "v7", inversion: "s2",longName: "minor seventh", semitones: 10, degrees: 6 },
    { shortName: "s7", inversion: "v2",longName: "major seventh", semitones: 11, degrees: 6 },
    { shortName: "p8", inversion: "p1",longName: "octave", semitones: 12, degrees:  7 },
];

// TODO: into English! check abbreviations and correct terms
// also shortNames of intervals to English
export const chordDefinitions = [
    { shortName: "M", longName: "majorTriad", intervalsUp: ["s3", "p5"], intervalsDown: ["v3", "p5"],
        midiIntervals: [0, 4, 7] }, // intervals from lower note
    { shortName: "m", longName: "minorTriad", intervalsUp: ["v3", "p5"], intervalsDown: ["s3", "p5"],
        midiIntervals: [0, 3, 7] },
    { shortName: "7", longName: "majorMinorSeventh", intervalsUp: ["s3", "p5", "v7"],
        intervalsDown: ["v3", "<5", "v7" ], midiIntervals: [0, 4, 7, 10]  },
    { shortName: "dim", longName: "diminishedTriad", intervalsUp: ["v3", "<5"], intervalsDown: ["v3", "<5"],
        midiIntervals: [0, 3, 6] },
    { shortName: "aug", longName: "augmentedTriad", intervalsUp: ["s3", ">5"], intervalsDown: ["s3", ">5"],
        midiIntervals: [0, 4, 8] }

];

export const scaleDefinitions = { // defined by intervals from tonic
    major : ["p1", "s2", "s3", "p4", "p5", "s6", "s7", "p8"],
    minor: ["p1", "s2", "v3", "p4", "p5", "v6", "v7", "p8"], // natural, to be certain that 'minor' is also defined
    minorNatural : ["p1", "s2", "v3", "p4", "p5", "v6", "v7", "p8"],
    minorHarmonic : ["p1", "s2", "v3", "p4", "p5", "v6", "s7", "p8"],
    minorMelodic : ["p1", "s2", "v3", "p4", "p5", "s6", "s7", "p8"],  // how to do that it is lower or higher?
};

export const makeScale = (tonicVtNote, scale) => { // returns array of vtNotes
    if (scaleDefinitions.hasOwnProperty(scale) ) {
        let vtNotes = [];
        const baseNote = notes.getNoteByVtNote(tonicVtNote);
        for (let interval of scaleDefinitions[scale]) {
            const degreeNote = makeInterval(baseNote, interval, "up"); // what if bass clef?
            console.log("Tonic, Interval, note: ", tonicVtNote, interval, degreeNote.vtNote );
            vtNotes.push(degreeNote.vtNote);
        }
        return vtNotes;

    } else {
        console.log("Could not find scale: ", scale );
        return [];
    }

};

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

    let interval = getIntervalBySemitones(Math.abs(semitones));
    return {note1: note1, note2: note2, interval: interval, direction: direction};
};

export const getIntervalBySemitones = (semitones) => {	// Return first interval found
    return intervalDefinitions.find(interval => interval.semitones === semitones);
};

export const getIntervalByShortName = (shortName) => intervalDefinitions.find(interval => interval.shortName === shortName);

export const makeInterval = (baseNote, shortName, direction="up", possibleNotes= notes.trebleClefNotes) => { // possibleNotes -  array of note objects
    // return found note as object or undefined otherwise

    const interval = getIntervalByShortName(shortName);
    if (interval === undefined) { // not found
        console.log(shortName," not found");
        return;
    }

    let semitones = interval.semitones;
    let degrees = interval.degrees;

    if (direction==="down") {
        semitones = -semitones;
        degrees = -degrees;
    }

    const oct1 = parseInt(baseNote.vtNote.split("/")[1]); // 4 for first octava etc
    const degree1 = baseNote.degree + oct1*7 ; // take also octave into account to get correct difference
    //console.log("note: ", note.midiNote, oct1, degree1);

    // find note by midiNote
    for (let note of possibleNotes) {
        const oct2 = parseInt(note.vtNote.split("/")[1]);
        const degree2 = note.degree + oct2*7;
        if ( (note.midiNote === baseNote.midiNote + semitones) &&  (degree2 === (degree1 + degrees)) ) {
            return note;
        }
    }

    return undefined;// otherwise return undefined
};

//makeChord -  build given chord from given note up/down
// return array of notes (objects)
export const makeChord = (baseNote, shortName, direction="up", possibleNotes = notes.trebleClefNotes) => {
    const chord = chordDefinitions.find(chord => chord.shortName === shortName);
    const intervals = (direction === "up") ? chord.intervalsUp : chord.intervalsDown; // these are shortnames of itnervals
    console.log("chord is: ", chord.shortName, intervals);
    let noteArray = [];
    noteArray.push(baseNote);
    for (let intervalShortName of intervals) {
        const note = makeInterval(baseNote, intervalShortName, direction, possibleNotes);
        if (note !== undefined) {
            noteArray.push(note);
        } else {
            console.log("Could not make interval from:", intervalShortName, baseNote.vtNote);
        }
    }
    return noteArray;
};

// makeVexTabChord -  sorts given noteArray and return chord in vextab notation
export const makeVexTabChord = (noteArray) => { // noteArray - array of type possibleNotes, to have midiNotes to sort those
    // sort, return vtString (<note>.<note>.<et>)
    if (noteArray.length<1) {
        console.log("Not enough notes for chord");
        return "";
    }
    let localArray = noteArray.slice(); // otherwise original array will be sorted
    localArray.sort(function(a,b) { return a.midiNote - b.midiNote; }  );
    let vtString = "("; // make vextab chord notation

    for (let i=0; i<localArray.length; i++) {
        if (i>0 && localArray[i] !== undefined) vtString += "."; // separator between chord notes
        if (localArray[i] !== undefined) {
            vtString += localArray[i].vtNote;
        }
    }
    vtString += ")";
    //console.log("Sorted chord: ", vtString);
    return vtString;
};

export const simplifyIfAugmentedIntervals = (interval) => {
    if (interval === ">4") {
        return "<5";
    } else if (interval === ">5") {
        return "v6";
    }

    return interval;
};