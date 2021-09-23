import React from 'react';
import euLogo from "../images/eu.jpg";
import {Grid} from "@material-ui/core"
import {capitalizeFirst} from "../util/util";
import {useTranslation} from "react-i18next";

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
                        (c) 2020, Tarmo Johannes, Edgar Tereping, Jane Tereping
                        </Grid>
                    <Grid item>
                        <small>{capitalizeFirst(t("feedback"))}: <a href={"tarmo.johannes@otsakool.edu.ee"}>tarmo.johannes@otsakool.edu.ee</a></small>
                    </Grid>

            {/*</div>*/}
        </Grid>
    );
};

export default AppFooter;