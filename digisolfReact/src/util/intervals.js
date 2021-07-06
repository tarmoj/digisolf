import * as notes from "./notes"

//TODO: shortNames to English -  check. perhams m, M, d, a ?
// + translations
// english abbreviations see https://hellomusictheory.com/learn/intervals/ (Music Interval Chart)
// m2, M2, D5, A4, P4, P5 etc
// vt ka Vex.Flow.Music.intervals
// küsi Theodore...

// 04.07.21 -  discoverd that <4 >5 were wrong, fixed.
const intervalDefinitions = [
    { shortName: "p1", inversion: "p8", longName: "unison", semitones: 0, degrees: 0 }, // degrees (astmeid) -  difference in scale degrees (Ces/C/Cis - 0,  Des/D/Dis - 1 etc)
    { shortName: "v2", inversion: "s7",longName: "minor second", semitones: 1, degrees: 1 },
    { shortName: "s2", inversion: "v7",longName: "major second", semitones: 2, degrees: 1 },
    { shortName: "<2", inversion: ">7",longName: "augmented second", semitones: 3, degrees: 1 },
    { shortName: "v3", inversion: "s6",longName: "minor third", semitones: 3, degrees: 2 },
    { shortName: "s3", inversion: "v6",longName: "major third", semitones: 4, degrees: 2 },
    { shortName: "p4", inversion: "p5",longName: "perfect fourth", semitones: 5, degrees: 3 },
    { shortName: "<4", inversion: ">5",longName: "augmented fourth", semitones: 6, degrees: 3 },
    { shortName: ">5", inversion: "<4",longName: "diminished fifth", semitones: 6, degrees: 4 },
    { shortName: "p5", inversion: "p4",longName: "perfect fifth", semitones: 7, degrees: 4 },
    { shortName: "<5", inversion: ">4",longName: "augmented fifth", semitones: 8, degrees: 4 },
    { shortName: "v6", inversion: "s3",longName: "minor sixth", semitones: 8, degrees: 5 },
    { shortName: "s6", inversion: "v3",longName: "major sixth", semitones: 9, degrees: 5 },
    { shortName: ">7", inversion: "<2",longName: "diminished seventh", semitones: 9, degrees: 6 },
    { shortName: "v7", inversion: "s2",longName: "minor seventh", semitones: 10, degrees: 6 },
    { shortName: "s7", inversion: "v2",longName: "major seventh", semitones: 11, degrees: 6 },
    { shortName: "p8", inversion: "p1",longName: "octave", semitones: 12, degrees:  7 },
];

// TODO: into English! check abbreviations and correct terms
// also shortNames of intervals to English
// chord names and theory: https://luffykudo.wordpress.com/2020/08/19/how-chords-are-made/
// define names and shrtnames for both classical and popjazz vocabulary
export const chordDefinitions = [
    { shortName: "M", shortNamePJ: "M", longName: "majorTriad", longNamePJ:"majorTriadPJ", intervalsUp: ["s3", "p5"], intervalsDown: ["v3", "p5"],
        midiIntervals: [0, 4, 7] }, // intervals from lower note
    { shortName: "m", shortNamePJ: "m" longName: "minorTriad", longNamePJ:"minorTriadPJ", intervalsUp: ["v3", "p5"], intervalsDown: ["s3", "p5"],
        midiIntervals: [0, 3, 7] },
    { shortName: "dim", shortNamePJ: "o", longName: "diminishedTriad", longNamePJ: "diminishedTriad", intervalsUp: ["v3", ">5"], intervalsDown: ["v3", ">5"],
        midiIntervals: [0, 3, 6] },
    { shortName: "aug", shortNamePJ:"+", longName: "augmentedTriad", longNamePJ:"augmentedTriad", intervalsUp: ["s3", "<5"], intervalsDown: ["s3", "<5"],
        midiIntervals: [0, 4, 8] },

    { shortName: "M6", shortNamePJ:"M/3", longName: "majorSixThree", longNamePJ: "firstInversionOfMajor", intervalsUp: ["v3", "v6"], intervalsDown: ["p4", "v6"],
        midiIntervals: [0, 3, 8] },
    { shortName: "m6", shortNamePJ:"m/3", longName: "minorSixThree", longNamePJ: "firstInversionMinor",intervalsUp: ["s3", "s6"], intervalsDown: ["p4", "s6"],
        midiIntervals: [0, 4, 9] },
    { shortName: "dim6", shortNamePJ:"o/3", longName: "firstInversionDiminishedTriad", longNamePJ: "firstInversionDiminishedTriadPJ",intervalsUp: ["v3", "s6"], intervalsDown: ["<4", "s6"],
        midiIntervals: [0, 3, 9] },

    { shortName: "M64", shortNamePJ:"M/5", longName: "majorSixFour", longNamePJ:"secondInversionMajor", intervalsUp: ["p4", "s6"], intervalsDown: ["s3", "s6"],
        midiIntervals: [0, 5, 9] },
    { shortName: "m64",  shortNamePJ:"m/5", longName: "minorSixFour", longNamePJ:"secondInversionMajor",intervalsUp: ["s3", "p5"], intervalsDown: ["v3", "p5"],
        midiIntervals: [0, 5, 8] },

    // septachords
    { shortName: "7", longName: "majorMinorSeventh", intervalsUp: ["s3", "p5", "v7"], intervalsDown: ["v3", ">5", "v7"],
        midiIntervals: [0,4,7,10] },
    { shortName: "m7", longName: "minorSeventh", intervalsUp: ["s3", "p5", "v7"], intervalsDown: ["v3", "p5", "v7"],
        midiIntervals: [0,3,7,10] },
    { shortName: "M7", longName: "majorSeventh", intervalsUp: ["s3", "p5", "s7"], intervalsDown: ["v3", "p5", "s7"],
        midiIntervals: [0,4,7,11] },
    { shortName: "hdim7", longName: "halfDiminishedSeventh", intervalsUp: ["v3", ">5", "v7"], intervalsDown: ["v3", ">5", "v7"],
        midiIntervals: [0,3,6,10] },
    { shortName: "dim7", longName: "diminishedSeventh", intervalsUp: ["v3", ">5", ">7"], intervalsDown: ["v3", ">5", ">7"],
        midiIntervals: [0,3,6,9] },
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

            if (degreeNote) {
                vtNotes.push(degreeNote.vtNote);
                //console.log("Tonic, Interval, note: ", tonicVtNote, interval, degreeNote.vtNote );
            } else {
                console.log("Could not build iterval from: ", interval, tonicVtNote);
            }
        }
        return vtNotes;

    } else {
        console.log("Could not find scale: ", scale );
        return [];
    }

};

export const getInterval = (note1, note2) => {
    const semitones = note2.midiNote - note1.midiNote;
    // find out difference in degrees, take octave into account:
    const oct1 = parseInt(note1.vtNote.split("/")[1]); // 4 for first octava etc
    const degree1 = note1.degree + oct1*7 ;
    const oct2 = parseInt(note2.vtNote.split("/")[1]); // 4 for first octava etc
    const degree2 = note2.degree + oct2*7 ;

    const degrees = Math.abs(degree2-degree1);

    //console.log("getInterval semitones, degrees: ", semitones, degrees);

    let direction;
    if (semitones > 0) {
        direction = "up";
    } else if (semitones === 0) {
        direction = "same";
    } else {
        direction = "down";
    }

    const interval = intervalDefinitions.find(interval => (interval.semitones === Math.abs(semitones)  && interval.degrees === degrees));
    return {interval: interval, direction: direction}; // ? Why should it return the notes that are parameters???
};

export const getIntervalBySemitones = (semitones) => {	// Return first interval found
    return intervalDefinitions.find(interval => interval.semitones === semitones);
};

export const getIntervalByShortName = (shortName) => intervalDefinitions.find(interval => interval.shortName === shortName);

export const makeInterval = (baseNote, shortName, direction="up", possibleNotes= notes.noteDefinitions) => { // possibleNotes -  array of note objects
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
export const makeChord = (baseNote, shortName, direction="up", possibleNotes = notes.noteDefinitions) => {
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
    if (interval === "<4") {
        return ">5";
    } else if (interval === "<5") {
        return "v6";
    } else if (interval === "<2") {
        return "v3"
    } else if (interval === ">7") {
        return "s6"
    }
    return interval;
};