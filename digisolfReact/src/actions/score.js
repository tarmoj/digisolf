export const incrementIncorrectAnswers = (noOfAnswers) => {
    return {
        type: "INCREMENT_INCORRECT_ANSWERS"
    }
};

export const incrementCorrectAnswers = (noOfAnswers) => {
    return {
        type: "INCREMENT_CORRECT_ANSWERS"
    }
};

export const resetScore = () => {
    return {
        type: "RESET_SCORE"
    }
};