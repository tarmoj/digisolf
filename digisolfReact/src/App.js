import React from 'react';
import './App.css';
import {useSelector} from "react-redux";
import AppHeader from "./componenets/AppHeader";
import AskInterval from "./componenets/AskInterval";
import MainMenu from "./componenets/MainMenu";
import AppFooter from "./componenets/AppFooter";
import LanguageSelect from "./componenets/LanguageSelect";

function App() {
    const component = useSelector(state => state.componentReducer.component);

    const renderComponent = () => {
        switch(component) {
            case "AskInterval":
                return <AskInterval/>;
            default:
                return <MainMenu/>;
        }
    };

    return (
        <div className="App">
            <div>
                <AppHeader/>
                <LanguageSelect/>
                <div className={"appBody"}>
                    {renderComponent()}
                </div>
                <AppFooter/>
            </div>
        </div>
    );
}

export default App;