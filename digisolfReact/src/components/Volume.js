import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setVolume} from "../actions/exercise";
import {useTranslation} from "react-i18next";
import {capitalizeFirst} from "../util/util";
import {Slider} from "react-semantic-ui-range";

// later: replace with materialui slider: https://material-ui.com/components/slider/

const Volume = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const volume = useSelector(state => state.exerciseReducer.volume);

    return (
        <>
            {capitalizeFirst(t("volume"))}
            <Slider value={volume} color="blue"
                    /*style={{maxWidth:200}}*/
                    settings={ {
                        min:0, max:1, step:0.01,
                        onChange: (value) => {
                            dispatch(setVolume(value));
                        }
                    } }
            />
        </>
    );
};

export default Volume