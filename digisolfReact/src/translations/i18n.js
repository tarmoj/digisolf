import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import est from "./est";
import eng from "./eng";
import lat from "./lat";
import w6ro from "./w6ro";

const resources = {
    est: {
        translation: est
    },
    eng: {
        translation: eng
    },
    lat: {
        translation: lat
    },
    w6ro: {
        translation: w6ro
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "est",
        fallbackLng: "est",

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;