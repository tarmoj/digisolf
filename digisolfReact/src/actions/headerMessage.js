export const setPositiveMessage = (text, delayedClose = 5000) => {
    return {
        type: "SET_POSITIVE_MESSAGE",
        payload: {
            text: text,
            delayedClose: delayedClose
        }
    }
};

export const setNegativeMessage = (text, delayedClose = 5000) => {
    return {
        type: "SET_NEGATIVE_MESSAGE",
        payload: {
            text: text,
            delayedClose: delayedClose
        }
    }
};

export const removeMessage = () => {
    return {
        type: "REMOVE_MESSAGE"
    }
};