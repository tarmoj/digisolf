const initialState = {
    incorrectAnswers: 0,
    correctAnswers: 0
};

export const scoreReducer = (state = initialState, action) => {
    switch(action.type) {
        case "INCREMENT_INCORRECT_ANSWERS":
            return {
                ...state,
                incorrectAnswers: state.incorrectAnswers + 1
            };
        case "INCREMENT_CORRECT_ANSWERS":
            return {
                ...state,
                correctAnswers: state.correctAnswers + 1
            };
        case "RESET_SCORE":
            return {
                ...state,
                correctAnswers: 0,
                incorrectAnswers: 0
            };
        default:
            return state;
    }
};
