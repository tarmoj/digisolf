function getRandomElementFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomBoolean() {
    return Math.random() >= 0.5;
}

function getTriadNote(isMajor, tonicNote, possibleNotes) {
    let newNote;

    while (newNote === undefined) {
        const newNoteMidiDifference = getRandomTriadNoteMidiDifference(isMajor);
        const newNoteMidiValue = tonicNote.midiNote + newNoteMidiDifference;
        newNote = possibleNotes.find(note => note.midiNote === newNoteMidiValue);
    }

    return newNote;
}

function getRandomTriadNoteMidiDifference(isMajor) {
    let possibleDifferences;

    if (isMajor) {
        possibleDifferences = [4, 7, 12, -5, -8, -12];
    } else {
        possibleDifferences = [3, 7, 12, -5, -9, -12];
    }

    return getRandomElementFromArray(possibleDifferences);
}

function getAllNotesWithSameName(note, noteArray) {
    let notes = [];

    for (let i = 0; i < noteArray.length; i++) {
        if (noteArray[i].vtNote.substring(0, noteArray[i].vtNote.length - 1) === note.vtNote.substring(0, note.vtNote.length - 1)) {
            notes.push(noteArray[i]);
        }
    }

    return notes;
}

function getRandomInt(from, to) {
    return from + Math.floor(Math.random()* (to-from));
}


// const getChordNotes = (tonicNote, isMajor, notes) => {
//     let chordNotes = [];
//
//     for (let i = 0, n = notes.length; i < n; i++) {
//         const simplifiedIntervalInSemitones = getSimplifiedIntervalInSemitones(tonicNote, notes[i]);
//         const noteIsLowerThanTonic = notes[i].midiNote < tonicNote.midiNote;
//
//         if (noteIsLowerThanTonic) {
//             if (isMajor) {
//                 if (simplifiedIntervalInSemitones === 5 || simplifiedIntervalInSemitones === 8 || simplifiedIntervalInSemitones === 0) {
//                     chordNotes.push(notes[i]);
//                 }
//             } else {
//                 if (simplifiedIntervalInSemitones === 5 || simplifiedIntervalInSemitones === 9 || simplifiedIntervalInSemitones === 0) {
//                     chordNotes.push(notes[i]);
//                 }
//             }
//         } else {
//             if (isMajor) {
//                 if (simplifiedIntervalInSemitones === 4 || simplifiedIntervalInSemitones === 7 || simplifiedIntervalInSemitones === 0) {
//                     chordNotes.push(notes[i]);
//                 }
//             } else {
//                 if (simplifiedIntervalInSemitones === 3 || simplifiedIntervalInSemitones === 7 || simplifiedIntervalInSemitones === 0) {
//                     chordNotes.push(notes[i]);
//                 }
//             }
//         }
//     }
//
//     // Remove duplicate notes with same midi value
//     const tonicNoteIsSharp = isSharp(tonicNote);
//     const tonicNoteIsFlat = isFlat(tonicNote);
//
//     const noOfNotes = chordNotes.length;
//     let previousNote = chordNotes[noOfNotes - 1];
//
//     for (let i = noOfNotes - 2; i >= 0; i--) {
//         if (previousNote.midiNote === chordNotes[i].midiNote) {
//             if (tonicNoteIsSharp) {
//                 if (isSharp(previousNote)) {
//                     chordNotes.splice(i, 1);
//                 } else {
//                     chordNotes.splice(i - 1, 1);
//                 }
//             } else if (tonicNoteIsFlat) {
//                 if (isFlat(previousNote)) {
//                     chordNotes.splice(i, 1);
//                 } else {
//                     chordNotes.splice(i - 1, 1);
//                 }
//             } else {
//                 if (tonicNote.vtNote.includes("C")) {
//                     if (isFlat(previousNote)) {
//                         chordNotes.splice(i, 1);
//                     } else {
//                         chordNotes.splice(i - 1, 1);
//                     }
//                 } else {
//                     if (isSharp(previousNote)) {
//                         chordNotes.splice(i, 1);
//                     } else {
//                         chordNotes.splice(i - 1, 1);
//                     }
//                 }
//             }
//         } else {
//             previousNote = chordNotes[i];
//         }
//     }
//
//     return chordNotes;
// };
//
// const isSharp = (note) => {
//     return note.vtNote.includes("#");
// };
//
// const isFlat = (note) => {
//     return note.vtNote.includes("@");
// };
//
// const getSimplifiedIntervalInSemitones = (note1, note2) => {
//     let interval = Math.abs(note1.midiNote - note2.midiNote);
//     while (interval >= 12) {
//         interval -= 12;
//     }
//
//     return interval;
// };