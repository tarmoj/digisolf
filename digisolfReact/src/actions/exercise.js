export const setIsHarmonic = (isHarmonic) => {
    return {
        type: "SET_IS_HARMONIC",
        payload: isHarmonic
    }
};

export const setName = (name) => {
    return {
        type: "SET_NAME",
        payload: name
    }
};

export const setCents = (cents) => {
    return {
        type: "SET_CENTS",
        payload: cents
    }
};

export const setUserEnteredNotes = (notes) => {
    return {
        type: "SET_USER_ENTERED_NOTES",
        payload: notes
    }
};