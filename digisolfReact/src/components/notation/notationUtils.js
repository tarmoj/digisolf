export const defaultSelectedNote = {
  note: "",
  accidental: "",
  duration: "4",
  dot: false,
  octave: "4",
  index: null
}

export const vtNames = {
  "whole":"1",
  "half":"2",
  "quarter":"4",
  "eighth":"8",
  "sixteenth":"16",
  "thirtysecond":"32",
  "dot":".",
  "dblflat":"@@",
  "flat":"@",
  "nat":"n",
  "sharp":"#",
  "dblsharp":"##",
  "rest": "##",
  "bb": "@@",
  "b": "@"
}

export const octaveData = {
  maxOctave: 5,
  minOctave: 3
}

// this is basic structure to keep all the score
// score includes staves,  staves include voices, voices include notes
export const defaultNotationInfo = {
  options: "", // scale, width, space etc, if needed
  staves: [
      {
          clef:"treble",
          key:"C",
          time: "4/4",
          voices: [
              {
                  notes: [
                      //{
                      //    keys: [], // like ["C/4", "Eb/4", "G/4"] for chord
                      //    duration: "", // like 4, 8, 2. etc
                     // }
                  ]
              }
          ]
      }
  ]
};
// use like: scoreInfo.staves[0].voices[0].notes[0] = {keys:["C/4"], duration: "2."}

export const notationInfoToVtString = notationInfo => {
  let vtString = "";
  // TODO: options
  for (let stave of notationInfo.staves) {
      vtString += `stave clef=${stave.clef} key=${stave.key} time=${stave.time} \n`;
      for (let voice of stave.voices) {
          vtString += "voice\n";
          if (voice.notes.length>0) {
              vtString += "notes ";
              for (let note of  voice.notes) {
                  // test if chord or single note. Several keys ->  ( . .  ) notation
                  if (note.keys.length>0) {
                      let noteString = "";
                      if (note.keys.length>1) {
                          noteString = `( ${note.keys.join(",")} )`;
                      } else if (note.keys.length === 1) {
                          noteString = note.keys[0];
                      }
                      if (note.keys[0]==="|" || note.keys[0].startsWith("=")) { // barline
                          vtString += ` ${note.keys[0]} `;
                      } else {
                          vtString += ` :${note.duration.replace(/\./g, "d")} ${noteString.replace(/b/g, "@")}`; // for any case, VexFlow->VexTab: dot -> d, (flat) b - > @
                      }
                  }
              }
          }
      }
  }
  return vtString;
};