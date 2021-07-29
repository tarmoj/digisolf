
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

export const setVolume = (volume) => {
    //console.log("Setting volume to: ", volume);
    localStorage.setItem("volume", volume);
    return {
        type: "SET_VOLUME",
        payload: volume // 0..1
    }
};

export const setInstrument = (instrument) => {
    //console.log("Set intrument in reducer: ", instrument);
    localStorage.setItem("instrument", instrument);
    return {
        type: "SET_INSTRUMENT",
        payload: instrument // for now: "flute|oboe|violin|guitar"
    }
};