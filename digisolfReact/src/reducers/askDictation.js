import {defaultNotationInfo, defaultSelectedNote, vtNames} from "../components/notation/notationUtils";
import {deepClone} from "../util/util";

const initialState = {
  selectedNote: defaultSelectedNote,
  previousSelectedNote: null,
  inputNotation: deepClone(defaultNotationInfo),
  correctNotation: deepClone(defaultNotationInfo),
  selectedStaveIndex: 0,
  selectedNoteSet: false,
  allowInput: false
}

export const askDictationReducer = (state = initialState, action) => {
  const staff = (action.payload && action.payload.voice) ? action.payload.voice : 0;
  const voice = (action.payload && action.payload.voice) ? action.payload.voice : 0;

  const vtNote = buildVtNoteString(state.selectedNote);
  const duration = buildVtDurationString(state.selectedNote);

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
            const currentVtNote = buildVtNoteString(currentSelectedNote);
            const currentDuration = buildVtDurationString(currentSelectedNote);
  
            currentInputNotation.staves[staff].voices[voice].notes.splice(selectedNoteIndex, 1, {keys:[currentVtNote], duration: currentDuration});
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
          return {
            ...state,
            selectedNote: action.payload,
            selectedNoteSet: true,
            previousSelectedNote: state.selectedNote
        };
        } else {
          console.warn("Given input is not a correct note object", action.payload);
          return {
            state
          }
        }
      case "INSERT_NOTE":
        currentInputNotation.staves[staff].voices[voice].notes.push({keys:[vtNote], duration: duration});

        return {
          ...state,
          inputNotation: currentInputNotation,
          selectedNoteSet: false
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
        selectedNote: defaultSelectedNote
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
    case "SET_CORRECT_NOTATION":
      return {
        ...state,
        correctNotation: action.payload
      };
    case "SET_INPUT_NOTATION":
      return {
        ...state,
        inputNotation: action.payload
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
}

const isCorrectNote = note => {
  if (typeof note === "object") {
    const noteProperties = Object.keys(note);
    noteProperties.forEach(property => {
      if (!isCorrectNoteProperty(property.toString())) {
        return false;
      }
    })
    return true;
  }

  return false;
}

const buildVtNoteString = selectedNote => {
  if (selectedNote) {
    const isRestSelected = selectedNote.note === vtNames["rest"];
    const isBarline = selectedNote.note === vtNames["barline"];
    return isRestSelected || isBarline ? selectedNote.note : selectedNote.note + selectedNote.accidental + "/" + selectedNote.octave;
  }

  return null;
}

const buildVtDurationString = selectedNote => {
  if (selectedNote) {
    const dot = selectedNote.dot ? vtNames["dot"] : "";
    const duration = selectedNote.duration + dot;
    return duration;
  }

  return null;
}