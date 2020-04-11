import React from 'react';
import './App.css';
import {useSelector} from "react-redux";
import HeaderMessage from "./components/HeaderMessage";
import AskInterval from "./components/AskInterval";
import AskChord from "./components/AskChord";
import AskIntonation from "./components/AskIntonation";
import MainMenu from "./components/MainMenu";
import AppFooter from "./components/AppFooter";
import LanguageSelect from "./components/LanguageSelect";
import {Header} from "semantic-ui-react";
import {useTranslation} from "react-i18next";

function App() {
    const component = useSelector(state => state.componentReducer.component);
    const { t, i18n } = useTranslation();

    const renderComponent = () => {
        switch(component) {
            case "AskInterval":
                return <AskInterval/>;
            case "AskChord":
                return <AskChord/>;
            case "AskIntonation":
                return <AskIntonation/>;
            default:
                return <MainMenu/>;
        }
    };


    return (
        <div className="App">
            <div className={"maxWidth"}>
                <div className={"appHeader"}>
                    <Header className={"headerText"} size='huge'>{t("digisolfeggio")}</Header>
                    <LanguageSelect/>
                    <HeaderMessage/>
                </div>
                <div className={"appBody"}>
                    {renderComponent()}
                    <AppFooter/>
                </div>
            </div>
        </div>
    );
}

export default App;