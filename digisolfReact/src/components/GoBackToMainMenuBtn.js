import React, {useEffect} from 'react';
import {Button} from '@material-ui/core'
import {useDispatch} from "react-redux";
import {setComponent, setCustomMenu, setIsLoading} from "../actions/component";
import MainMenu from "./MainMenu";
import {resetScore} from "../actions/score";
import {useTranslation} from "react-i18next";
import {setUserEnteredNotes} from "../actions/exercise";
import {useHistory} from "react-router-dom";
import {capitalizeFirst, isInIframe} from "../util/util";

const GoBackToMainMenuBtn = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();


    const goBack = () => {
        dispatch(setComponent("MainMenu"));
        dispatch(resetScore());
        dispatch(setUserEnteredNotes(""));
        dispatch(setIsLoading(false));
        dispatch(setCustomMenu(null));
        history.push("/digisolf");
        document.title = capitalizeFirst(t("digisolfeggio"));
    };


    // do not show  goBackButton when in iframe (when shown in e-koolikott)
    return isInIframe() ? null : <Button variant={"contained"} onClick={goBack} className={"fullWidth marginTopSmall"}>{t("goBack")}</Button>;
};

export default GoBackToMainMenuBtn