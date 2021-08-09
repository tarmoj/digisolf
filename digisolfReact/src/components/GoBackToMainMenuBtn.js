import React, {useEffect} from 'react';
import {Button} from '@material-ui/core'
import {useDispatch} from "react-redux";
import {setComponent, setIsLoading} from "../actions/component";
import MainMenu from "./MainMenu";
import {resetScore} from "../actions/score";
import {useTranslation} from "react-i18next";
import {setUserEnteredNotes} from "../actions/exercise";
import {useHistory} from "react-router-dom";

const GoBackToMainMenuBtn = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();


    const goBack = () => {
        dispatch(setComponent("MainMenu"));
        dispatch(resetScore());
        dispatch(setUserEnteredNotes(""));
        dispatch(setIsLoading(false));
        history.push("/digisolf");
    };

    return <Button variant={"contained"} onClick={goBack} className={"fullWidth marginTopSmall"}>{t("goBack")}</Button>;
};

export default GoBackToMainMenuBtn