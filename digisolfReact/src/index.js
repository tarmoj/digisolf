import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import './translations/i18n';
import "@fontsource/roboto"; // Defaults to weight 400. see https://github.com/fontsource/fontsource/blob/main/packages/roboto/README.md
// .. and https://material-ui.com/components/typography/#general for warning about different weights

const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
