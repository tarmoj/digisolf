const initialState = {
    component: "Login",
    previousComponent: ""
};

export const componentReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_COMPONENT":
            return {
                ...state,
                component: action.payload,
                previousComponent: state.component
            };
        default:
            return state;
    }
};
