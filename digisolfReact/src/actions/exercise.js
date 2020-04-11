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