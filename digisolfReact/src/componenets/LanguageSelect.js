import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Dropdown, Image} from "semantic-ui-react";
import flagEE from "../images/flagEE.png";
import flagGB from "../images/flagGB.png";
import flagLV from "../images/flagLV.png";
import {setLanguage} from "../actions/language";
import i18n from '../translations/i18n';

const LanguageSelect = () => {
    const language = useSelector(state => state.languageReducer.language);

    const dispatch = useDispatch();

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

    const handleLanguageChange = (event, { value }) => {
        dispatch(setLanguage(value));
        i18n.changeLanguage(value);
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

    return (
        <Dropdown
            className={"languageSelect"}
            value={language}
            onChange={handleLanguageChange}
            trigger={trigger}
            options={options}
            pointing='top right'
            icon={null}
        />
    )
};

export default LanguageSelect;