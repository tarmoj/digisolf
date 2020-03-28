import React from 'react';
import {Button, Grid, Header} from 'semantic-ui-react'
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {setComponent} from "../actions/component";
import {setIsHarmonic, setIsTonic, setName} from "../actions/exercise";

const MainMenu = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const goToTonicTriadHarmonic = () => {
        dispatch(setIsHarmonic(true));
        dispatch(setIsTonic(true));
        dispatch(setName("askIntervalTonicTriad"));
        dispatch(setComponent("AskInterval"));
    };

    return (
        <Grid columns={2}>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <Header size='large'>{t("intervals")}</Header>
                    <Button className={"mainMenuBtn"} onClick={goToTonicTriadHarmonic}>{t("tonicTriad")} - {t("harmonic")}</Button><br/>
                    <Button className={"marginTop mainMenuBtn"}>{t("severalIntervals")} - {t("harmonic")}</Button><br/>
                </Grid.Column>
                <Grid.Column>
                    <div>
                        <Header size='large'>{t("chords")}</Header>
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
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default MainMenu