import React from 'react';
import {useDispatch, useSelector} from "react-redux";
//import {Dropdown, Image} from "semantic-ui-react";
import flagEE from "../images/flagEE.png";
import flagGB from "../images/flagGB.png";
import flagLV from "../images/flagLV.png";
import {setLanguage} from "../actions/language";
//import i18n from '../translations/i18n';
import {useTranslation} from "react-i18next";
import {InputLabel, MenuItem, Select} from '@material-ui/core';

const LanguageSelect = () => {
    const language = useSelector(state => state.languageReducer.language);

    const dispatch = useDispatch();

    const { t, i18n } = useTranslation();

    const handleLanguageChange = (event) => {
        console.log("set value to:", event.target.value);
        const lang = event.target.value;
        dispatch(setLanguage(lang));
        i18n.changeLanguage(lang);
    };
/*
    const languageToFlag = (language) => {
        switch(language) {
            case "est":
                return flagEE;
            case "w6ro":
                return flagEE;
            case "eng":
                return flagGB;
            case "lat":
                return flagLV;
            default:
                return flagEE;
        }
    };



    const trigger = (
        <span>
            <Image avatar src={languageToFlag(language)} />
        </span>
    );

    const options = [
        { key: 'est', text: 'Eesti keel', value: "est", image: { avatar: false, src: languageToFlag("est") }},
        { key: 'w6ro', text: 'Wõro kiil', value: "w6ro", image: { avatar: false, src: languageToFlag("w6ro") }},
        { key: 'eng', text: 'English', value: "eng", image: { avatar: false, src: languageToFlag("eng") }},
        { key: 'lat', text: 'Latvijas', value: "lat", image: { avatar: false, src: languageToFlag("lat") }}
    ];
*/
    //MAybe use menu with an image trigger instead of select
    return (
        <>
            {/*InputLabel would be proper way for accessibility - test later
            <InputLabel id="label">{t("languageSelect")}</InputLabel>*/}
        <Select
            disabled={true}
            labelId="label" id="select"
            className={"languageSelect"}
            value={language}
            onChange={handleLanguageChange}
        >
            <MenuItem value={"est"}><img src={flagEE} alt={"Eesti lipp"} /> Eesti</MenuItem>
            <MenuItem value={"lat"}> <img src={flagLV} alt={"Latvian flag"} /> Latviski</MenuItem>
            <MenuItem value={"eng"}><img src={flagGB} alt={"English flag"} /> English</MenuItem>
        </Select>
        </>
        /*<Dropdown
            className={"languageSelect"}
            value={language}
            onChange={handleLanguageChange}
            trigger={trigger}
            options={options}
            pointing='top right'
            icon={null}
        />*/
    )
};

export default LanguageSelect;