import React from 'react';
import {Image} from 'semantic-ui-react'
import euLogo from "../images/eu.jpg";
import {Grid} from "@material-ui/core"

//TODO: logo must be visible
const AppFooter = () => {
    return (
        <Grid container className={"marginTop"} direction={"column"} alignItems={"flex-start"}>
            {/*<div className={"marginTop"}>*/}

                    <Grid item>
                        <img className={"footerLogo"} fluid={"true"} src={euLogo} />
                    </Grid>
                    <Grid item>
                        <p>(c) 2020, Tarmo Johannes, Edgar Tereping, Jane Tereping</p>
                    </Grid>

            {/*</div>*/}
        </Grid>
    );
};

export default AppFooter;