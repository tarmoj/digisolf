import React from 'react';
import './App.css';
import {useSelector} from "react-redux";
import HeaderMessage from "./componenets/HeaderMessage";
import AskInterval from "./componenets/AskInterval";
import AskChord from "./componenets/AskChord";
import MainMenu from "./componenets/MainMenu";
import AppFooter from "./componenets/AppFooter";
import LanguageSelect from "./componenets/LanguageSelect";
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
                </div>
                <AppFooter/>
            </div>
        </div>
    );
}

export default App;