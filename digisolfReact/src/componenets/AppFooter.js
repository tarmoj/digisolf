import React from 'react';
import {Grid, Image} from 'semantic-ui-react'
import euLogo from "../images/eu.jpg";

const AppFooter = () => {
    return (
        <Grid>
            <div className={"marginTop"}>
                <Grid.Row>
                    <Grid.Column>
                        <Image className={"footerLogo"} fluid src={euLogo} />
                    </Grid.Column>
                    <Grid.Column>
                        <p className={"authors"}>(c) 2020, Tarmo Johannes, Edgar Tereping</p>
                    </Grid.Column>
                </Grid.Row>
            </div>
        </Grid>
    );
};

export default AppFooter;