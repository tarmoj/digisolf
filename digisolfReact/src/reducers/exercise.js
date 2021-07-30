const initialState = {
    userEnteredNotes: "",
    VISupportMode:localStorage.getItem("VISupportMode")==="true" || false, // false makes now sense though.Just to show the default value
    volume:  localStorage.getItem("volume") || 0.6, //
    instrument : localStorage.getItem("instrument") || "oboe"
};

export const exerciseReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_VI_SUPPORT_MODE" : return {
            ...state,
            VISupportMode: action.payload
        }

        case "SET_USER_ENTERED_NOTES":
            return {
                ...state,
                userEnteredNotes: action.payload
            };
        case "SET_VOLUME":
            return {
                ...state,
                volume: action.payload
            };
        case "SET_INSTRUMENT":
            return {
                ...state,
                instrument: action.payload
            };

        default:
            return state;
    }
};
