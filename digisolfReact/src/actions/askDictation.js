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