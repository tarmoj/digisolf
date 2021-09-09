import React, {useRef, useState} from 'react';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import HeaderMessage from "./components/HeaderMessage";
import AskInterval from "./components/AskInterval";
import AskChord from "./components/AskChord";
import AskIntonation from "./components/AskIntonation";
import AskTuning from "./components/AskTuning";
import AskFunctions from "./components/AskFunctions";
import AskDictation from "./components/askdictation/AskDictation";
import MainMenu from "./components/MainMenu";
import AppFooter from "./components/AppFooter";
import LanguageSelect from "./components/LanguageSelect";
//import {Dimmer, Header,  Loader} from "semantic-ui-react";
import {Backdrop, Checkbox, CircularProgress, IconButton, Menu, MenuItem} from '@material-ui/core';

import {useTranslation} from "react-i18next";
import { BrowserRouter as Router, Switch, Route, } from 'react-router-dom';
import {setVISupportMode} from "./actions/exercise";
import {Visibility, VisibilityOff, SentimentDissatisfied} from "@material-ui/icons";
import MenuIcon from '@material-ui/icons/Menu';
import {createTheme} from "@material-ui/core";
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import {capitalizeFirst} from "./util/util"; // not certain if it works this way

function App() {
    const isLoading = useSelector(state => state.componentReducer.isLoading);
    const customMenu = useSelector(state=>state.componentReducer.customMenu);
    const [VISupport, setVISupport] = useState(localStorage.getItem("VISupportMode")==="true")


    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();


    // vt: https://stackoverflow.com/questions/57222924/override-material-ui-button-text
    const myTheme = createTheme({
        overrides: {
            MuiButton: {
                root: {
                    textTransform: 'none'
                }
            }
        },
    });

    const renderComponent = () => {
        return (
            <Router>
                <Switch>
                    <Route exact path='/digisolf' component={MainMenu}/>
                    <Route path='/digisolf/askinterval/:exerciseName/:parameters?' component={AskInterval} />}/>
                    <Route path='/digisolf/askchord/:name/' component={AskChord}/>
                    <Route path='/digisolf/askfunctions/:title?' component={AskFunctions}/>
                    <Route path='/digisolf/askdictation/:name/:title?' component={AskDictation}/>
                    <Route path='/digisolf/askintonation/:name/:cents' component={AskIntonation}/>
                    <Route path='/digisolf/asktuning' component={AskTuning}/>
                </Switch>
            </Router>
        )
    };

    const showDimmer = () => { // not sure if it should be used. disablind "Start exercise" is probably enough
        if (isLoading) {
            // TODO: check that some components are not above backdrop
            return <Backdrop sx={{ z:0 }} open={isLoading}>
                {/*<Loader size='massive'>{t("loading")}</Loader>*/}
                <CircularProgress
                // should add somewhere: {"aria-describedby":"loading", "aria-busy":isLoading}}
                />
            </Backdrop>
        }
    };

    const createViSupportSelection = () => {

        return (

            <Checkbox className={"VISupport"} color={"default"}
                      checked={VISupport}
                      onChange={(e) => {
                          setVISupport(e.target.checked);
                          dispatch(setVISupportMode(e.target.checked))
                      }
                      }
                      icon={<Visibility />} checkedIcon={<VisibilityOff />}
                      inputProps={{ 'aria-label': t("visuallyImpairedSupport") }}
            />
        );
    }

    //const complaintMenuButton = useRef();
    const settingsMenuButton = useRef();
    //const [complaintMenuOpen, setComplaintMenuOpen] = useState(false);
    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
    // const createComplaintsMenu = () => {
    //     return (
    //         <>
    //             <IconButton className={"complaintMenuButton"} aria-label="issuesMenu"  onClick={() => setComplaintMenuOpen(!complaintMenuOpen)} ref={complaintMenuButton}> <SentimentDissatisfied /> </IconButton>
    //             <Menu
    //                 id="simple-menu"
    //                 anchorEl={complaintMenuButton.current}
    //                 keepMounted
    //                 open={complaintMenuOpen}
    //                 onClose={()=>setComplaintMenuOpen(false)}
    //             >
    //                 <MenuItem onClick={() => {
    //                     window.open("https://github.com/tarmoj/digisolf/blob/gh-pages/digisolfReact/known_issues.md", '_blank');
    //                     setComplaintMenuOpen(false);
    //                 }
    //                 }>{capitalizeFirst(t("knownIssues"))}</MenuItem>
    //                 <MenuItem onClick={() => {
    //                     window.open("https://github.com/tarmoj/digisolf/issues/new", '_blank');
    //                     setComplaintMenuOpen(false);
    //                 }
    //                 }>{capitalizeFirst(t("reportIssue"))}</MenuItem>
    //
    //             </Menu>
    //         </>
    //     );
    // };

    const createSettingsMenu = () => {
        return (
            <>
                <IconButton className={"languageSelect"} aria-label="settingsMenu"  onClick={() => setSettingsMenuOpen(!settingsMenuOpen)} ref={settingsMenuButton}> <MenuIcon /> </IconButton>
                <Menu
                    id="settings-menu"
                    anchorEl={settingsMenuButton.current}
                    keepMounted
                    open={settingsMenuOpen}
                    onClose={()=>setSettingsMenuOpen(false)}
                >
                    <MenuItem disabled={true}><LanguageSelect /></MenuItem>
                    <MenuItem onClick={() => {
                        window.open("https://github.com/tarmoj/digisolf/blob/gh-pages/digisolfReact/known_issues.md", '_blank');
                        setSettingsMenuOpen(false);
                    }
                    }>{capitalizeFirst(t("knownIssues"))}</MenuItem>
                    <MenuItem onClick={() => {
                        window.open("https://github.com/tarmoj/digisolf/issues/new", '_blank');
                        setSettingsMenuOpen(false);
                    }
                    }>{capitalizeFirst(t("reportIssue"))}</MenuItem>
                    {customMenu}
                </Menu>
            </>

        );
    }

    return (
        <ThemeProvider theme={myTheme}>
        <div className="App">
            <div className={"maxWidth"}>
                <div className={"appHeader"}>
                    <h1 className={"headerText"} >{t("digisolfeggio")}</h1>
                    {createViSupportSelection()}
                    {createSettingsMenu()}
                    {/*<LanguageSelect/>*/}
                </div>
                <HeaderMessage />
                <div className={"appBody"}>
                    {renderComponent()}
                    <AppFooter/>
                </div>
                {showDimmer()}
            </div>
        </div>
        </ThemeProvider>
    );
}

export default App;