export const setSelected = (property, value) => {
  return {
      type: "SET_SELECTED",
      payload: {
        property: property,
        value: value
      }
  }
};

export const setSelectedNote = note => {
  return {
      type: "SET_SELECTED_NOTE",
      payload: note
  }
};

export const insertNote = note => {
  return {
    type: "INSERT_NOTE",
    payload: note
  }
};

export const removeNote = (index, voice, staff) => {
  return {
    type: "REMOVE_NOTE",
    payload: {
      index: index,
      voice: voice,
      staff: staff
    }
  }
}

export const editNote = () => {
  return {
    type: "EDIT_NOTE"
  }
};

export const setSelectedNoteSet = (noteIsSet) => {
  return {
    type: "SET_SELECTED_NOTE_SET",
    payload: noteIsSet
  }
};

export const setAllowInput = (allowInput) => {
  return {
    type: "SET_ALLOW_INPUT",
    payload: allowInput
  }
};

export const resetState = () => {
  return {
    type: "RESET_STATE"
  }
};
/*
export const setCorrectNotation = (correctNotation) => {
  return {
    type: "SET_CORRECT_NOTATION",
    payload: correctNotation
  }
};
*/

export const setInputNotation = (inputNotation) => {
  return {
    type: "SET_INPUT_NOTATION",
    payload: inputNotation
  }
};

export const setSelectedStaff = staff => {
  return {
    type: "SET_SELECTED_STAFF",
    payload: staff
  }
};