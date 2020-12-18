import { combineReducers } from "redux";
import {componentReducer} from "./component";
import {languageReducer} from "./language";
import {exerciseReducer} from "./exercise";
import {headerMessageReducer} from "./headerMessage";
import {scoreReducer} from "./score";
import {askDictationReducer} from "./askDictation";

const appReducer = combineReducers({
    componentReducer,
    languageReducer,
    exerciseReducer,
    headerMessageReducer,
    scoreReducer,
    askDictationReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'someAction') {
        // Tee midagi
    }

    return appReducer(state, action)
};

export default rootReducer;