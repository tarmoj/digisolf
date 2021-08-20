import React, {useEffect, useState} from 'react';
import {Grid, Icon, Transition, Popup} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {resetScore} from "../actions/score";
import Sound from "react-sound";
import correctSound from "../sounds/varia/correct.mp3"
import wrongSound from "../sounds/varia/wrong.mp3"


const ScoreRow = (props) => {
    const correctAnswers = useSelector(state => state.scoreReducer.correctAnswers);
    const incorrectAnswers = useSelector(state => state.scoreReducer.incorrectAnswers);
    const VISupportMode = useSelector(state => state.exerciseReducer.VISupportMode);

    useEffect( ()=>{
        if (correctAnswers>0 && VISupportMode) {
            setSoundFile(correctSound);
            setPlayStatus(Sound.status.PLAYING);
        }
    }, [correctAnswers] );

    useEffect( ()=>{
        if (incorrectAnswers>0 && VISupportMode) {
            setSoundFile(wrongSound);
            setPlayStatus(Sound.status.PLAYING);
        }
    }, [incorrectAnswers] );

    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
    const [soundFile, setSoundFile] = useState("");

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const transitionTime = 600;

    const getPositiveScore = () => {
        return (
            <Transition visible={correctAnswers > 0} animation='slide down' duration={transitionTime}>
                <div className={"floatLeft marginRight green bold"}>
                    <Icon color={"green"} name='thumbs up outline'  aria-label={t("correct")}/>
                    {correctAnswers}
                </div>
            </Transition>
        )
    };

    const getNegativeScore = () => {
        return (
            <Transition visible={incorrectAnswers > 0} animation='slide down' duration={transitionTime}>
                <div className={"floatLeft marginRight red bold"}>
                    <Icon color={"red"} name='thumbs down outline' aria-label={t("wrong")}/>
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


    return (
        <>
            <Grid.Row className={"exerciseRow scoreRow"} columns={2}>
                <Grid.Column floated='left' width={5}>
                    <Grid.Row className={'score'}>
                        {getPositiveScore()}
                        {getNegativeScore()}
                        {getResetScoreButton()}
                    </Grid.Row>
                </Grid.Column>
            </Grid.Row>
            {VISupportMode && <Sound
                url={soundFile}
                loop={false}
                playStatus={playStatus}
                onFinishedPlaying={() => setSoundFile("")}
            />}
        </>
    )
};

export default ScoreRow;