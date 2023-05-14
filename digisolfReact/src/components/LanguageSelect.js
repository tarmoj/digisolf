import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import flagEE from "../images/flagEE.png";
import flagGB from "../images/flagGB.png";
import {setLanguage} from "../actions/language";
import {useTranslation} from "react-i18next";
import { MenuItem, Select} from '@material-ui/core';

const LanguageSelect = () => {
    const language = useSelector(state => state.languageReducer.language);

    const dispatch = useDispatch();

    const { t, i18n } = useTranslation();

    const handleLanguageChange = (event) => {
        console.log("set value to:", event.target.value);
        const lang = event.target.value;
        dispatch(setLanguage(lang));
        //i18n.changeLanguage(lang);
    };

    // rewrite perhaps with IconButton
    return (
        <Select
            disabled={false}
            labelId="label" id="select"
            // className={"languageSelect"}
            value={language}
            onChange={handleLanguageChange}
        >
            <label id="label" hidden>{t("languageSelect")}</label>
            {/*<MenuItem value={"est"}><img src={flagEE} alt={"Eesti"} aria-label={"Eesti"}/></MenuItem>*/}
            <MenuItem value={"est"} aria-label={"Eesti"}>EST</MenuItem>
            <MenuItem value={"ru"} aria-label={"Russian"}> RU </MenuItem>
            {/*<MenuItem value={"eng"}><img src={flagGB} alt={"English"} /></MenuItem>*/}
        </Select>
    )
};

export default LanguageSelect;