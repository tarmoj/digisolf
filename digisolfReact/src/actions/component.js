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