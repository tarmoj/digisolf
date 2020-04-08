import React from 'react';
import {Button, Grid, Header} from 'semantic-ui-react'
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {setComponent} from "../actions/component";
import {setIsHarmonic, setName} from "../actions/exercise";

const MainMenu = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const startTonicTriad = (isHarmonic) => {
        dispatch(setIsHarmonic(isHarmonic));
        dispatch(setName("askIntervalTonicTriad"));
        dispatch(setComponent("AskInterval"));
    };

    const startChord = (name) => {
        dispatch(setName(name));
        dispatch(setComponent("AskChord"));
    };

    const startIntonation = (name) => {
        dispatch(setName(name));
        dispatch(setComponent("AskIntonation"));
    };

    return (
        <Grid columns={2}>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <Header size='large'>{t("intervals")}</Header>
                    <Button className={"mainMenuBtn"} onClick={() => startTonicTriad(true)}>{t("tonicTriad")} - {t("harmonic")}</Button><br/>
                    <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startTonicTriad(false)}>{t("tonicTriad")} - {t("melodic")}</Button><br/>
                    <Button className={"marginTopSmall mainMenuBtn"}>{t("severalIntervals")} - {t("harmonic")}</Button><br/>
                </Grid.Column>
                <Grid.Column>
                    <div>
                        <Header size='large'>{t("chords")}</Header>
                        <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startChord("MmTriad")}>{t("MmTriad")}</Button><br/>
                        <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startChord("MmdaTriad")}>{t("MmdaTriad")}</Button><br/>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <Header size='large'>{t("dictations")}</Header>
                </Grid.Column>
                <Grid.Column>
                    <div>
                        <Header size='large'>{t("intonation")}</Header>
                        <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startIntonation("+-30")}>{t("+-30")}</Button><br/>

                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default MainMenu