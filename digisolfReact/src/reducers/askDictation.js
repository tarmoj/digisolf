import {
  defaultAccidental,
  defaultHeld,
  defaultNotationInfo,
  defaultOctave,
  defaultSelectedNote,
  vtNames
} from "../components/notation/notationUtils";
import {deepClone} from "../util/util";

const initialState = {
  selectedNote: defaultSelectedNote,
  previousSelectedNote: null,
  inputNotation: deepClone(defaultNotationInfo),
  correctNotation: deepClone(defaultNotationInfo),
  selectedStaff: 0,  // was: staveIndex
  selectedNoteSet: false,
  allowInput: false,
  currentOctave: defaultOctave,
  currentAccidental: defaultAccidental,
  currentHeld: defaultHeld
};

export const askDictationReducer = (state = initialState, action) => {
  //const staff = (action.payload && action.payload.staff) ? action.payload.staff : 0;
  //test: - seems to work
  const staff = state.selectedStaff;

  const voice = (action.payload && action.payload.voice) ? action.payload.voice : 0;

  let vtNote = buildVtNoteString(state.selectedNote, state.currentOctave, state.currentAccidental, state.currentHeld);
  let duration = buildVtDurationString(state.selectedNote);

  const selectedNoteIndex = state.selectedNote.index;
  let currentInputNotation = Object.assign({}, state.inputNotation);
  let currentSelectedNote = Object.assign({}, state.selectedNote);

  switch(action.type) {
      case "SET_SELECTED":
        const property = action.payload.property;
        const value = action.payload.value;

        if (isCorrectNoteProperty(property)) {
          currentSelectedNote[property] = value;
          if (state.selectedNoteSet) {
            if (!currentSelectedNote.duration) {
              currentSelectedNote.duration = defaultSelectedNote.duration;
            }
            vtNote = buildVtNoteString(currentSelectedNote, state.currentOctave, state.currentAccidental, state.currentHeld);
            duration = buildVtDurationString(currentSelectedNote);

            // this is insert at current position:
            currentInputNotation.staves[staff].voices[voice].notes.splice(selectedNoteIndex, 1, {keys:[vtNote], duration: duration});
          }
          return {
            ...state,
            selectedNote: currentSelectedNote,
            inputNotation: currentInputNotation
          };
        } else {
          console.warn("state.selectedNote does not have a property of", property);
          return {
            state
          };
        }
      case "SET_SELECTED_NOTE":
        if (isCorrectNote(action.payload)) {
          const newSelectedNote = currentInputNotation.staves[staff].voices[voice].notes[action.payload.index];

          return {
            ...state,
            currentOctave: action.payload.octave ?? state.currentOctave,
            currentAccidental: action.payload.accidental ?? state.currentAccidental,
            selectedNote: action.payload,
            selectedNoteSet: true,
            previousSelectedNote: state.selectedNote,
            currentHeld: hasNoteBeenHeld(newSelectedNote) ? vtNames["held"] : defaultHeld
        };
        } else {
          console.warn("Given input is not a correct note object", action.payload);
          return {
            state
          }
        }
      case "SELECT_PREVIOUS_SELECTED_NOTE":
        const includeAccidental = action.payload;
        return {
          ...state,
          selectedNote: state.previousSelectedNote,
          currentAccidental: includeAccidental ? state.currentAccidental : defaultAccidental
        }
      case "INSERT_NOTE":
        vtNote = buildVtNoteString(currentSelectedNote, state.currentOctave, state.currentAccidental, state.currentHeld);
        duration = buildVtDurationString(currentSelectedNote);

        currentInputNotation.staves[staff].voices[voice].notes.push({keys:[vtNote], duration: duration});

        return {
          ...state,
          inputNotation: currentInputNotation,
          selectedNoteSet: false,
          currentHeld: state.currentHeld !== defaultHeld ? defaultHeld : state.currentHeld
        };
    case "INSERT_VT_NOTE":
      vtNote = action.payload;
      duration = buildVtDurationString(currentSelectedNote);

      if (state.selectedNoteSet) {
        currentInputNotation.staves[staff].voices[voice].notes.splice(selectedNoteIndex, 1, {keys:[vtNote], duration: duration});
      } else {
        currentInputNotation.staves[staff].voices[voice].notes.push({keys:[vtNote], duration: duration});
      }

      return {
        ...state,
        inputNotation: currentInputNotation,
        //selectedNoteSet: false
      };
      case "REMOVE_NOTE":
        const currentNotesLength = currentInputNotation.staves[staff].voices[voice].notes.length;
        if (currentNotesLength === 0) {
          console.warn("Staff/voice is empty, nothing to remove: ", staff, voice);
          return {
            ...state
          }
        }

        if (selectedNoteIndex) {
          currentInputNotation.staves[staff].voices[voice].notes.splice(selectedNoteIndex, 1);
        } else {
          currentInputNotation.staves[staff].voices[voice].notes.pop();
        }

        currentSelectedNote.index = null;

        if (currentNotesLength === 1) {
          return {
            ...state,
            inputNotation: currentInputNotation,
            selectedNoteSet: false,
            selectedNote: currentSelectedNote
          }
        }

        return {
          ...state,
          inputNotation: currentInputNotation,
          selectedNote: currentSelectedNote
        }
    case "SET_SELECTED_NOTE_SET": 
      return {
        ...state,
        selectedNoteSet: action.payload,
        selectedNote: defaultSelectedNote,
        currentAccidental: defaultAccidental,
        currentHeld: defaultHeld
      };
    case "SET_CURRENT_OCTAVE":
      vtNote = buildVtNoteString(currentSelectedNote, action.payload, state.currentAccidental, state.currentHeld);
      duration = buildVtDurationString(currentSelectedNote);

      currentInputNotation.staves[staff].voices[voice].notes.splice(selectedNoteIndex, 1, {keys:[vtNote], duration: duration});
      return {
        ...state,
        currentOctave: action.payload,
        inputNotation: currentInputNotation
      };
    case "SET_CURRENT_ACCIDENTAL":

      let accidental = action.payload;
      if (state.currentAccidental === accidental) {
        accidental = "";
      }

      if (state.selectedNoteSet) {
        vtNote = buildVtNoteString(currentSelectedNote, state.currentOctave, accidental, state.currentHeld);
        duration = buildVtDurationString(currentSelectedNote);
  
        currentInputNotation.staves[staff].voices[voice].notes.splice(selectedNoteIndex, 1, {keys:[vtNote], duration: duration});
      }

      return {
        ...state,
        currentAccidental: accidental,
        inputNotation: currentInputNotation
      };
    case "SET_CURRENT_HELD":
      const newHeld = state.currentHeld ? defaultHeld : vtNames["held"];

      if (state.selectedNoteSet) {
        vtNote = buildVtNoteString(currentSelectedNote, state.currentOctave, state.accidental, newHeld);
        duration = buildVtDurationString(currentSelectedNote);

        currentInputNotation.staves[staff].voices[voice].notes.splice(selectedNoteIndex, 1, {keys:[vtNote], duration: duration});
      }

      return {
        ...state,
        currentHeld: newHeld,
        inputNotation: currentInputNotation
      };
    case "SET_ALLOW_INPUT":
      return {
        ...state,
        allowInput: action.payload
      };
    case "RESET_STATE":
      return {
        ...initialState,
        inputNotation: deepClone(defaultNotationInfo)
      };

    // case "SET_CORRECT_NOTATION":
    //   return {
    //     ...state,
    //     correctNotation: action.payload
    //   };
    case "SET_INPUT_NOTATION":
      return {
        ...state,
        correctNotation: newCorrectNotation,
        inputNotation: currentInputNotation
      };
    case "SET_SELECTED_STAFF":
      //test:
      //console.log("Set selected staff in reducer: ", action.payload); // <- this is correct
      return {
        ...state,
        selectedStaff: action.payload
      };
      default:
        return state;
  }
};

const isCorrectNoteProperty = property => {
  if (typeof property === "string") {
    const correctProperties = Object.keys(defaultSelectedNote);
    return correctProperties.includes(property);
  }

  return false;
};

const isCorrectNote = note => {
  if (typeof note === "object") {
    const noteProperties = Object.keys(note);
    noteProperties.forEach(property => {
      if (!isCorrectNoteProperty(property.toString())) {
        return false;
      }
    });
    return true;
  }

  return false;
};

const buildVtNoteString = (selectedNote, octave = defaultOctave, accidental = defaultAccidental, held = defaultHeld) => {
  if (selectedNote) {
    const isRestSelected = selectedNote.note === vtNames["rest"];
    const isBarline = selectedNote.note === vtNames["barline"];
    return isRestSelected || isBarline ? selectedNote.note : held + selectedNote.note + accidental + "/" + octave.toString();
  }

  return null;
};

const buildVtDurationString = selectedNote => {
  if (selectedNote) {
    const dot = selectedNote.dot ? vtNames["dot"] : "";
    const duration = selectedNote.duration + dot;
    return duration;
  }

  return null;
};

const hasNoteBeenHeld = note => {
  return note.keys[0].startsWith(vtNames["held"]);
}