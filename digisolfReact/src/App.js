import React, {useEffect, useRef, useState} from 'react';
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
import {
    Backdrop,
    Checkbox,
    CircularProgress,
    Divider,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Tooltip
} from '@material-ui/core';

import {useTranslation} from "react-i18next";
import { BrowserRouter as Router, Switch, Route, } from 'react-router-dom';
import {setVISupportMode} from "./actions/exercise";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import MenuIcon from '@material-ui/icons/Menu';
import {createTheme} from "@material-ui/core";
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import {capitalizeFirst, isInIframe} from "./util/util";
import {setSettingsMenuOpen} from "./actions/component"; // not certain if it works this way
import euLogo from "./images/eu.jpg";
import AskDegreeDictation from "./components/askdictation/AskDegreeDictation";


function App() {
    const isLoading = useSelector(state => state.componentReducer.isLoading);
    const customMenu = useSelector(state=>state.componentReducer.customMenu);
    const menuOpen = useSelector(state=>state.componentReducer.settingsMenuOpen);
    const [VISupport, setVISupport] = useState(localStorage.getItem("VISupportMode")==="true")

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();


    const settingsMenuButton = useRef();

    const language = useSelector(state => state.languageReducer.language);
    console.log("Language in app: ", language);

    // set and store language change:
    useEffect( () => {
        i18n.changeLanguage(language);
        localStorage.setItem("digiSolfLanguage", language);
    }, [language] );



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

                    <Route path='/digisolf/askinterval/:exerciseName/:parameters?' component={AskInterval} />}/>
                    <Route path='/digisolf/askchord/:name/' component={AskChord}/>
                    <Route path='/digisolf/askfunctions/:title?' component={AskFunctions}/>
                    <Route path='/digisolf/askdictation/:name/:title?' component={AskDictation}/>
                    <Route path='/digisolf/askdegreedictation/:name/:title?' component={AskDegreeDictation}/>
                    <Route path='/digisolf/askintonation/:name/:cents' component={AskIntonation}/>
                    <Route path='/digisolf/asktuning' component={AskTuning}/>
                    <Route exact path='/digisolf/:language?' component={MainMenu}/>
                </Switch>
            </Router>
        )
    };

    // to raise backdrop:
    const useStyles = makeStyles((theme) => ({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }));

    const classes = useStyles();

    const showDimmer = () => { // not sure if it should be used. disablind "Start exercise" is probably enough
        if (isLoading) {
            // TODO: check that some components are not above backdrop
            return <Backdrop className={classes.backdrop}  open={isLoading} aria-busy={isLoading} aria-label={"loading"}>
                <CircularProgress color={"inherit"} />
            </Backdrop>
        }
    };

    const createViSupportSelection = () => {

        return (
            <Tooltip title={capitalizeFirst(t("visuallyImpairedSupport"))}>
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
            </Tooltip>
        );
    }

    const handleClose = () => dispatch(setSettingsMenuOpen(false));


    const createSettingsMenu = () => {
        //const isInIframe = window.location !== window.parent.location;
        return (
            <>
                <IconButton  className={"languageSelect"} aria-label="settingsMenu"  onClick={() => dispatch(setSettingsMenuOpen(true))} ref={settingsMenuButton}> <MenuIcon /> </IconButton>
                <Menu
                    id="settings-menu"
                    anchorEl={settingsMenuButton.current}
                    keepMounted
                    open={menuOpen}
                    onClose={handleClose}
                >
                    <MenuItem disabled={false}><span className={"marginRightSmall"}>{capitalizeFirst(t("language"))}:</span><LanguageSelect /></MenuItem>
                    <Divider />
                    { !isInIframe() && // necessary since in e-koolikott where it shown in iFrame the links don't work
                    [
                        <MenuItem key={"menu1"} onClick={() => {
                            window.open("https://github.com/tarmoj/digisolf/blob/gh-pages/digisolfReact/known_issues.md", '_blank');
                            handleClose();
                        }
                        }>{capitalizeFirst(t("knownIssues"))}</MenuItem>,
                        <MenuItem key={"menu2"} onClick={() => {
                            window.open("https://github.com/tarmoj/digisolf/issues/new", '_blank');
                            handleClose();
                        }
                        }>{capitalizeFirst(t("reportIssue"))}</MenuItem>
                    ]
                    }
                    <Divider />
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
                <img className={"footerLogo_new"} alt={"Supported by EU"} src={euLogo} />
            </div>

        </div>
        </ThemeProvider>
    );
}

export default App;