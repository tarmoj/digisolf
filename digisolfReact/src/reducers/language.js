
const initialState = {
    language:  localStorage.getItem("digiSolfLanguage") || "est",
};

export const languageReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_LANGUAGE":
            const newLanguage = action.payload;
            return {
                ...state,
                language: action.payload,
            };
        default:
            return state;
    }
};
