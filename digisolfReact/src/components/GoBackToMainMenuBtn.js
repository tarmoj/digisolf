import React from 'react';
import {Button} from 'semantic-ui-react'
import {useDispatch} from "react-redux";
import {setComponent} from "../actions/component";
import MainMenu from "./MainMenu";
import {resetScore} from "../actions/score";
import {useTranslation} from "react-i18next";

const GoBackToMainMenuBtn = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const goBack = () => {
        dispatch(setComponent("MainMenu"));
        dispatch(resetScore());
    };

    return <Button onClick={goBack} className={"fullWidth marginTopSmall"}>{t("goBack")}</Button>;
};

export default GoBackToMainMenuBtn