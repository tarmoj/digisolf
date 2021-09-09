export const setComponent = (component) => {
    return {
        type: "SET_COMPONENT",
        payload: component
    }
};

export const setIsLoading = (isLoading) => {
    return {
        type: "SET_IS_LOADING",
        payload: isLoading
    }
};

export const setCustomMenu = (menu) => {
    return {
        type: "SET_CUSTOM_MENU",
        payload: menu
    }
};