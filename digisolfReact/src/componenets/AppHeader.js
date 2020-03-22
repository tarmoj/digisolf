import React from 'react';
import {Header} from 'semantic-ui-react'
import {useTranslation} from "react-i18next";

const AppHeader = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className={"AppHeader"}>
            <Header size='huge' className={"headerText"}>{t("digisolfeggio")}</Header>
        </div>
    );
};

export default AppHeader;