import React from 'react';
import { Grid } from '@material-ui/core';
import SelectInstrument from "./SelectInstrument";
import Volume from "./Volume";

const VolumeRow = () => {
    return (
        <Grid item container spacing={1} direction={"row"}>
            <Grid item container spacing={1} direction={"row"}>
                <Grid item xs={4}> <SelectInstrument /> </Grid>
                <Grid item xs={5}> <Volume /> </Grid>
            </Grid>
        </Grid>
    );
};

export default VolumeRow;