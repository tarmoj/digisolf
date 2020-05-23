import React from 'react';
import {Button, Grid, Header} from 'semantic-ui-react'
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {setComponent} from "../actions/component";
import {setName, setCents} from "../actions/exercise";
import {capitalizeFirst} from "../util/util";
import {BrowserRouter as Router, useHistory} from "react-router-dom";

const MainMenu = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    const startIntervalExercise = (name) => {
        dispatch(setName(name));
        dispatch(setComponent("AskInterval"));
        history.push("/digisolf/askinterval");
    };

    const startChord = (name) => {
        dispatch(setName(name));
        dispatch(setComponent("AskChord"));
        history.push("/digisolf/askchord");
    };

    const startDictation = (name) => {
        dispatch(setName(name));
        dispatch(setComponent("AskDictation"));
        history.push("/digisolf/askchord");
        console.log("Start dictation");
    };

    const startIntonation = (name, cents) => {
        dispatch(setName(name));
        dispatch(setCents(cents));
        dispatch(setComponent("AskIntonation"));
        history.push("/digisolf/askintonation");

    };

    return (
        <Router>
        <Grid columns={2}>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <Header size='large'>{t("intervals")}</Header>
                    <Button className={"mainMenuBtn"} onClick={() => startIntervalExercise("tonicTriad")}>{capitalizeFirst(t("tonicTriad"))}</Button><br/>
                    <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startIntervalExercise("tonicAllScaleDegrees")}>{capitalizeFirst(t("tonicAllScaleDegrees"))}</Button><br/>
                    <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startIntervalExercise("allScaleDegrees")}>{capitalizeFirst(t("allScaleDegrees"))}</Button><br/>
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
                    {/*siia oleks vaja teha tegelikult Dropdown sorti menüü*/}
                    <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startDictation("simple")}>{capitalizeFirst(t("simple"))}</Button><br/>

                </Grid.Column>
                <Grid.Column>
                    <div>
                        <Header size='large'>{t("intonation")}</Header>
                        <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startIntonation("+-30", 30)}>{t("+-30")}</Button><br/>
                        <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startIntonation("+-20", 20)}>{t("+-20")}</Button><br/>
                        <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startIntonation("+-10", 10)}>{t("+-10")}</Button><br/>
                        <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startIntonation("+-5", 5)}>{t("+-5")}</Button><br/>
                        <Button className={"marginTopSmall mainMenuBtn"} onClick={() => startIntonation("randomDeviation", 0)}>{t("anyDeviation")}</Button><br/>

                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        </Router>
    );
};

export default MainMenu