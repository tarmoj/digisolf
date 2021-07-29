const initialState = {
    userEnteredNotes: "",
    VISupportMode:localStorage.getItem("VISupportMode") || false // false makes now sense though.Just to show the default value
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
        default:
            return state;
    }
};
