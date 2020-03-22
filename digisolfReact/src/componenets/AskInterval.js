import React from 'react';
import {Button, Grid, Header, Icon, Input, Message, Modal, Table} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setComponent} from "../actions/component";

const AskInterval = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const isHarmonic = useSelector(state => state.exerciseReducer.isHarmonic);
    const isTonic = useSelector(state => state.exerciseReducer.isTonic);
    const name = useSelector(state => state.exerciseReducer.name);

    const goBack = () => {
        dispatch(setComponent("MainMenu"));
    };

    return (
        <div className={"exerciseBtns"}>
            <Header size='large'>{name}</Header>
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column>

                    </Grid.Column>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("unison")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("minor")} {t("2nd")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("major")} {t("2nd")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("minor")} {t("3rd")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("major")} {t("3rd")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>

                    </Grid.Column>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("perfect")} {t("4th")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("tritone")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("perfect")} {t("5th")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("minor")} {t("6th")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("major")} {t("6th")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("minor")} {t("7th")}</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("major")} {t("7th")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>

                    </Grid.Column>
                    <Grid.Column>
                        <Button className={"exerciseBtn"}>{t("octave")}</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Button onClick={goBack} className={"fullWidth marginTop"}>{t("goBack")}</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};

export default AskInterval