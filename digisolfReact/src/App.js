import React from 'react';
import './App.css';
import {useSelector} from "react-redux";
import HeaderMessage from "./components/HeaderMessage";
import AskInterval from "./components/AskInterval";
import AskChord from "./components/AskChord";
import AskIntonation from "./components/AskIntonation";
import AskDictation from "./components/AskDictation";
import MainMenu from "./components/MainMenu";
import AppFooter from "./components/AppFooter";
import LanguageSelect from "./components/LanguageSelect";
import {Dimmer, Header, Loader} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import { BrowserRouter as Router, Switch, Route, } from 'react-router-dom';

function App() {
    const component = useSelector(state => state.componentReducer.component);
    const isLoading = useSelector(state => state.componentReducer.isLoading);

    const { t, i18n } = useTranslation();

    const renderComponent = () => {
        // switch(component) {
        //     case "AskInterval":
        //         return <AskInterval/>;
        //     case "AskChord":
        //         return <AskChord/>;
        //     case "AskDictation":
        //         return <AskDictation/>;
        //     case "AskIntonation":
        //         return <AskIntonation/>;
        //     default:
        //         return <MainMenu/>;
        // }
        return (
            <Router>
                <Switch>
                    <Route exact path='/digisolf' render={() => <MainMenu/>}/>
                    <Route exact path='/digisolf/askinterval' render={() => <AskInterval/>}/>
                    <Route exact path='/digisolf/askchord' render={() => <AskChord/>}/>
                    <Route exact path='/digisolf/askdictation' render={() => <AskDictation/>}/>
                    <Route exact path='/digisolf/askintonation' render={() => <AskIntonation/>}/>
                </Switch>
            </Router>
        )
    };

    const showDimmer = () => {
        if (isLoading) {
            return <Dimmer active>
                <Loader size='massive'>{t("loading")}</Loader>
            </Dimmer>
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
                {showDimmer()}
            </div>
        </div>
    );
}

export default App;