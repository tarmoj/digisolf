const initialState = {
    positiveMessage: "",
    negativeMessage: "",
    delayedClose: null  // milliseconds
};

export const headerMessageReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_POSITIVE_MESSAGE":
            return {
                ...state,
                positiveMessage: action.payload.text,
                negativeMessage: "",
                delayedClose: action.payload.delayedClose
            };
        case "SET_NEGATIVE_MESSAGE":
            return {
                ...state,
                positiveMessage: "",
                negativeMessage: action.payload.text,
                delayedClose: action.payload.delayedClose
            };
        case "REMOVE_MESSAGE":
            return {
                ...state,
                positiveMessage: "",
                negativeMessage: ""
            };
        default:
            return state;
    }
};