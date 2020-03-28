import { combineReducers } from "redux";
import {componentReducer} from "./component";
import {languageReducer} from "./language";
import {exerciseReducer} from "./exercise";
import {headerMessageReducer} from "./headerMessage";

const appReducer = combineReducers({
    componentReducer,
    languageReducer,
    exerciseReducer,
    headerMessageReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'someAction') {
        // Tee midagi
    }

    return appReducer(state, action)
};

export default rootReducer;