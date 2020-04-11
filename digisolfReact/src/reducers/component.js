const initialState = {
    component: "Login",
    previousComponent: "",
    isLoading: false
};

export const componentReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_COMPONENT":
            return {
                ...state,
                component: action.payload,
                previousComponent: state.component
            };
        case "SET_IS_LOADING":
            return {
                ...state,
                isLoading: action.payload
            };
        default:
            return state;
    }
};
