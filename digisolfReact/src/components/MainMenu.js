import React from 'react';
//import { Grid} from 'semantic-ui-react'
import {Button, Grid} from "@material-ui/core"
import {useTranslation} from "react-i18next";
import {capitalizeFirst} from "../util/util";
import {BrowserRouter as Router, useHistory} from "react-router-dom";

const MainMenu = () => {
    const { t, i18n } = useTranslation();
    //const dispatch = useDispatch();
    const history = useHistory();

    // TODO: resize buttons in grid, make shure there are 2 columns
    // võibolla kuidagi stiilis flexGrow: 1
    return (
        <Router>
        <Grid container direction={"column"}>

            <Grid container item direction={"row"}>
                <Grid item xs={6}>
                    <h2 className={"marginTopSmall"}>{t("intervals")}</h2>
                    <Button variant="contained" className={"mainMenuBtn"} onClick={() => history.push("/digisolf/askinterval/tonicTriad")}>{capitalizeFirst(t("tonicTriad"))}</Button><br/>
                    <Button variant="contained"  className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askinterval/tonicAllScaleDegrees")}>{capitalizeFirst(t("tonicAllScaleDegrees"))}</Button><br/>
                    <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askinterval/allScaleDegrees")}>{capitalizeFirst(t("allScaleDegrees"))}</Button><br/>
                    <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askinterval/randomInterval")}>{capitalizeFirst(t("notInKey"))}</Button><br/>
                </Grid>
                <Grid item xs={6}>
                    <div>
                        <h2 className={"marginTopSmall"}>{t("chords")}</h2>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askchord/MmTriad")}>{capitalizeFirst(t("MmTriad"))}</Button><br/>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askchord/MmdaTriad")}>{capitalizeFirst(t("MmdaTriad"))}</Button><br/>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askchord/MmInversions")}>{capitalizeFirst(t("MmInversions"))}</Button><br/>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askchord/MmdaInversions")}>{capitalizeFirst(t("MmdaInversions"))}</Button><br/>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askchord/7inversions")}>{capitalizeFirst(t("7inversions"))}</Button><br/>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askchord/septachords")}>{capitalizeFirst(t("septachords"))}</Button><br/>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askchord/allChords")}>{capitalizeFirst(t("allChords"))}</Button><br/>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askfunctions")}>{capitalizeFirst(t("functions"))}</Button><br/>

                    </div>
                </Grid>
            </Grid>

            <Grid container item direction={"row"}>
                <Grid item xs={6}>
                    <h2 className={"marginTopSmall"}>{t("dictations")}</h2>
                    <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askdegreedictation/degrees")}>{capitalizeFirst(t("degreeDictations"))}</Button><br/>
                    <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askdegreedictation/degrees_random")}>{capitalizeFirst(t("degreeDictations"))} - {t("generated") }</Button><br/>
                    <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askdictation/1voice")}>{capitalizeFirst(t("oneVoice"))}</Button><br/>
                    <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askdictation/2voice")}>{capitalizeFirst(t("twoVoice"))}</Button><br/>
                    <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askdictation/popJazz")}>{capitalizeFirst(t("popJazz"))}</Button><br/>
                    <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askdictation/classical")}>{capitalizeFirst(t("classical"))}</Button><br/>
                </Grid>
                <Grid item xs={6}>
                    <div>
                        <h2 className={"marginTopSmall"}>{capitalizeFirst(t("tuning"))}</h2>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/asktuning")}>{ capitalizeFirst( t("intonateInterval") )}</Button><br/>
                        <h4 className={"marginTopSmall"}>{capitalizeFirst(t("isInTune"))}</h4>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askintonation/+-30/30")}>{t("+-30")}</Button><br/>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askintonation/+-20/20")}>{t("+-20")}</Button><br/>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askintonation/+-10/10")}>{t("+-10")}</Button><br/>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askintonation/+-5/5")}>{t("+-5")}</Button><br/>
                        <Button variant="contained" className={"marginTopSmall mainMenuBtn"} onClick={() => history.push("/digisolf/askintonation/randomDeviation/0")}>{t("anyDeviation")}</Button><br/>
                        
                    </div>
                </Grid>
            </Grid>
        </Grid>
        </Router>
    );
};

export default MainMenu