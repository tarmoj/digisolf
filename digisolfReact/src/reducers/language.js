const initialState = {
    language: "est",
};

export const languageReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_LANGUAGE":
            return {
                ...state,
                language: action.payload,
            };
        default:
            return state;
    }
};
