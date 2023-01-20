import React from 'react';
import euLogo from "../images/eu.jpg";
import {Grid} from "@material-ui/core"
import {capitalizeFirst} from "../util/util";
import {useTranslation} from "react-i18next";
import packageInfo from '../../package.json';


const version = packageInfo.version;

//TODO: logo must be visible
const AppFooter = () => {

    const { t, i18n } = useTranslation();

    return (
        <Grid container className={"marginTop"} direction={"column"} alignItems={"flex-start"} spacing={1}>
            {/*<div className={"marginTop"}>*/}

                    {/*<Grid item>
                        <img className={"footerLogo"} src={euLogo} />
                    </Grid>*/}
                    <Grid item>
                        {capitalizeFirst(t("version"))} {version} (c) 2023, Tarmo Johannes, Edgar Tereping, Jane Tereping
                        </Grid>
                    <Grid item>
                        <small>{capitalizeFirst(t("feedback"))}: <a href={"mailto:tarmo.johannes@otsakool.edu.ee"}>tarmo.johannes@otsakool.edu.ee</a></small>
                    </Grid>

            {/*</div>*/}
        </Grid>
    );
};

export default AppFooter;