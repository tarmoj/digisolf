const initialState = {
    isHarmonic: true,
    name: "",
    cents: 0, // TEST for intonation exercise,
    userEnteredNotes: "",
    VISupportMode: false
};

export const exerciseReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_VI_SUPPORT_MODE" : return {
            ...state,
            VISupportMode: action.payload
        }
        case "SET_IS_HARMONIC":
            return {
                ...state,
                isHarmonic: action.payload
            };
        case "SET_NAME":
            return {
                ...state,
                name: action.payload
            };
        case "SET_CENTS": // TEST
            return {
                ...state,
                cents: action.payload
            };
        case "SET_USER_ENTERED_NOTES":
            return {
                ...state,
                userEnteredNotes: action.payload
            };
        default:
            return state;
    }
};
