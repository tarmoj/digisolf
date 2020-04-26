import React, {useState} from 'react';
import {Button, Grid, Icon, Radio, Transition, Form, Popup} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {resetScore} from "../actions/score";
import {capitalizeFirst} from "../util/util";
import {setIsHarmonic} from "../actions/exercise";

const ScoreRow = (props) => {
    const correctAnswers = useSelector(state => state.scoreReducer.correctAnswers);
    const incorrectAnswers = useSelector(state => state.scoreReducer.incorrectAnswers);

    const [playStyle, setPlayStyle] = useState("harmonic");

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const transitionTime = 600;

    const getPositiveScore = () => {
        return (
            <Transition visible={correctAnswers > 0} animation='slide down' duration={transitionTime}>
                <div className={"floatLeft marginRight green bold"}>
                    <Icon color={"green"} name='thumbs up outline' />
                    {correctAnswers}
                </div>
            </Transition>
        )
    };

    const getNegativeScore = () => {
        return (
            <Transition visible={incorrectAnswers > 0} animation='slide down' duration={transitionTime}>
                <div className={"floatLeft marginRight red bold"}>
                    <Icon color={"red"} name='thumbs down outline' />
                    {incorrectAnswers}
                </div>
            </Transition>
        )
    };

    const getResetScoreButton = () => {
        return (
            <Transition visible={correctAnswers > 0 || incorrectAnswers > 0} animation='slide down' duration={transitionTime}>
                <div className={"resetScoreButton"}>
                    <Popup position='top center' trigger={<Icon name='times' onClick={() => dispatch(resetScore())} className={"floatLeft"} />}>
                        <Popup.Content>
                            {t("resetScore")}
                        </Popup.Content>
                    </Popup>
                </div>
            </Transition>
        )
    };

    const showRadioButtons = () => {
        if (props.showRadioButtons) {
            return (
                <Grid.Column floated='right' width={5}>
                    <Form.Field className={'scoreRadioField'}>
                        <Radio
                            label={capitalizeFirst(t("harmonic"))}
                            value='harmonic'
                            checked={playStyle === 'harmonic'}
                            onChange={handleRadioChange}
                        />
                    </Form.Field>
                    <Form.Field className={'scoreRadioField'}>
                        <Radio
                            label={capitalizeFirst(t("melodic"))}
                            value='melodic'
                            checked={playStyle === 'melodic'}
                            onChange={handleRadioChange}
                        />
                    </Form.Field>
                </Grid.Column>
            )
        }
    };

    const handleRadioChange = (e, { value }) => {
        dispatch(setIsHarmonic(value === "harmonic"));
        setPlayStyle(value);
    };

    return (
        <Grid.Row className={"exerciseRow scoreRow"} columns={2}>
            <Grid.Column floated='left' width={5}>
                <Grid.Row className={'score'}>
                    {getPositiveScore()}
                    {getNegativeScore()}
                    {getResetScoreButton()}
                </Grid.Row>
            </Grid.Column>
            {showRadioButtons()}
        </Grid.Row>
    )
};

export default ScoreRow;