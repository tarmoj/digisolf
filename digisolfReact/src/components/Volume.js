import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setVolume} from "../actions/exercise";
import {useTranslation} from "react-i18next";
import {capitalizeFirst} from "../util/util";
//import {Slider} from "react-semantic-ui-range";
import { Slider } from '@material-ui/core';

// later: replace with materialui slider: https://material-ui.com/components/slider/

const Volume = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const volume = useSelector(state => state.exerciseReducer.volume);

    return (
        <>
            {capitalizeFirst(t("volume"))}
            <Slider value={volume}
                /*style={{maxWidth:200}}*/
                    aria-label={t("volume")}
                    aria-valuetext={volume.toFixed(2)}
                    min={0} max={1} step={0.01}
                    onChange ={(event, value) => {
                        dispatch(setVolume(value));
                    }
                    }
            />
        </>
    );
};

export default Volume