import React from 'react';
import {Button, Grid, Icon, Transition} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {resetScore} from "../actions/score";

const Score = () => {
    const correctAnswers = useSelector(state => state.scoreReducer.correctAnswers);
    const incorrectAnswers = useSelector(state => state.scoreReducer.incorrectAnswers);

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const transitionTime = 600;

    const getPositiveScore = () => {
        return (
            <Transition visible={correctAnswers > 0} animation='slide down' duration={transitionTime}>
                <div className={"floatLeft marginLeft green bold"}>
                    <Icon color={"green"} name='thumbs up outline' />
                    {correctAnswers}
                </div>
            </Transition>
        )
    };

    const getNegativeScore = () => {
        return (
            <Transition visible={incorrectAnswers > 0} animation='slide down' duration={transitionTime}>
                <div className={"floatLeft marginLeft red bold"}>
                    <Icon color={"red"} name='thumbs down outline' />
                    {incorrectAnswers}
                </div>
            </Transition>
        )
    };

    const getResetScoreButton = () => {
        return (
            <Transition visible={correctAnswers > 0 || incorrectAnswers > 0} animation='slide down' duration={transitionTime}>
                <Grid.Row className={"exerciseRow"} columns={2}>
                    <Grid.Column>
                        <Button size={"mini"} onClick={() => dispatch(resetScore())} className={"floatLeft marginLeft"}>{t("resetScore")}</Button>
                    </Grid.Column>
                    <Grid.Column/>
                </Grid.Row>
            </Transition>
        )
    };

    return (
        <div className={"score"}>
            <Grid.Row className={"exerciseRow"} columns={2}>
                <Grid.Column>
                    {getPositiveScore()}
                    {getNegativeScore()}
                </Grid.Column>
                <Grid.Column/>
            </Grid.Row>
            {getResetScoreButton()}
        </div>
    )
};

export default Score;