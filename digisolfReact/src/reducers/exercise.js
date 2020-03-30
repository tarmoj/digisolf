const initialState = {
    isHarmonic: true,
    name: ""
};

export const exerciseReducer = (state = initialState, action) => {
    switch(action.type) {
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
        default:
            return state;
    }
};
