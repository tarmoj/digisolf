
export const setUserEnteredNotes = (notes) => {
    return {
        type: "SET_USER_ENTERED_NOTES",
        payload: notes
    }
};

export const setVISupportMode = (active) => {
    //console.log("Set VISupportMode to: ", active);
    localStorage.setItem("VISupportMode", active);
    return {
        type: "SET_VI_SUPPORT_MODE",
        payload: active // true|false
    }
};