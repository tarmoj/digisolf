export const defaultStateValues = {
  note: "",
  accidental: "",
  duration: "",
  dot: false,
  octave: "4"
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
  "rest": "##"
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
                      {
                          keys: [], // like ["C/4", "Eb/4", "G/4"] for chord
                          duration: "", // like 4, 8, 2. etc
                      }
                  ]
              }
          ]
      }
  ]
};
// use like: scoreInfo.staves[0].voices[0].notes[0] = {keys:["C/4"], duration: "2."}