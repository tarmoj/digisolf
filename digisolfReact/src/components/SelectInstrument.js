import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setInstrument} from "../actions/exercise";
import {useTranslation} from "react-i18next";
import {capitalizeFirst} from "../util/util";
import {Dropdown} from "semantic-ui-react";

// later: replace with materialui slider: https://material-ui.com/components/slider/

const SelectInstrument = (props) => { // pass 'callback' via props that does something with the instrument
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    //const instrument = useSelector(state => state.exerciseReducer.instrument);

    return (
        <>
            {capitalizeFirst(t("instrument"))+": "}
            <Dropdown
                onChange={ async (event, data) => {
                    const instrument = data.value;
                    console.log("New sound is: ", instrument);
                    dispatch(setInstrument(instrument));
                    // handle the change via hook (see AskInstrument.js) or callback from props.callback
                    // if (typeof (props.callback==="function")) {
                    //     props.callback(instrument);
                    // }
                 }
                }
                options ={ [
                    {text: t("flute"), value:"flute"},
                    {text: t("oboe"), value:"oboe"},
                    {text: t("violin"), value:"violin"},
                    {text: t("guitar"), value:"guitar"}
                ]  }
                defaultValue={useSelector(state => state.exerciseReducer.instrument)}

            />
        </>
    );
};

export default SelectInstrument