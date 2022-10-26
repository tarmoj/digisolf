import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setInstrument} from "../actions/exercise";
import {useTranslation} from "react-i18next";
import {capitalizeFirst} from "../util/util";
import {MenuItem, Select} from "@material-ui/core"


const SelectInstrument = (props) => { // pass 'callback' via props that does something with the instrument
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    //const instrument = useSelector(state => state.exerciseReducer.instrument);
    const selectedInstrument =   useSelector(state => state.exerciseReducer.instrument);
    return (
        <>
            {capitalizeFirst(t("instrument"))+": "}
            <Select
                labelId="instrumentLabel" id="selectInstrument"
                value={selectedInstrument}
                onChange={  (event) => {
                    const instrument = event.target.value;
                    console.log("New sound is: ", instrument);
                    dispatch(setInstrument(instrument));
                    // handle the change via hook (see AskInstrument.js) or callback from props.callback
                    if (typeof(props.callback)==="function") {
                        props.callback(instrument);
                    }
                }
                }
            >
                <label id="instrumentLabel" hidden>{t(selectedInstrument)}</label>
                <MenuItem value={"flute"}>{t("flute")}</MenuItem>
                <MenuItem value={"oboe"}> {t("oboe")}</MenuItem>
                <MenuItem value={"violin"}>{t("violin")}</MenuItem>
                <MenuItem value={"guitar"}>{t("guitar")}</MenuItem>
                {/*<MenuItem value={"clarinet"}>{t("clarinet")}</MenuItem>*/}
                {/*<MenuItem value={"trumpet"}>{t("trumpet")}</MenuItem>*/}
                {/*<MenuItem value={"bassoon"}>{t("bassoon")}</MenuItem>*/}
                {/*<MenuItem value={"trombone"}>{t("trombone")}</MenuItem>*/}
                {/*<MenuItem value={"cello"}>{t("cello")}</MenuItem>*/}
            </Select>
            </>
            );
};

export default SelectInstrument;