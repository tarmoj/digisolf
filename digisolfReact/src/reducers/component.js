const initialState = {
    component: "Login",
    previousComponent: "",
    isLoading: false,
    customMenu: null,
    settingsMenuOpen: false
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
        case "SET_CUSTOM_MENU":
            return {
                ...state,
                customMenu: action.payload

            };
        case "SET_SETTINGS_MENU_OPEN":
            console.log("reducer settingsMenuOpen:", action.payload);
            return {
                ...state,
                settingsMenuOpen: action.payload
            };
        default:
            return state;
    }
};
