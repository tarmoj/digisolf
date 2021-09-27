import React, { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    Grid,
    Select,
    MenuItem,
    Slider,
    RadioGroup,
    FormControlLabel,
    Radio, FormControl, FormLabel, Switch, Accordion, AccordionSummary, AccordionDetails
} from '@material-ui/core';
import {useTranslation} from "react-i18next";
import {capitalizeFirst} from "../util/util";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import CsoundObj from "@kunstmusik/csound";
import  {tuningOrchestra as orc} from "../csound/orchestras";
import {setVolume} from "../actions/exercise";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";


// NB!!!! start with  export HOST="localhost" ; npm start for local testing, with other hostnames sound input does not work

class ExpandMoreIcon extends React.Component {
    render() {
        return null;
    }
}

const AskTuning = () => {
    const { t, i18n } = useTranslation();


    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [intervalRatio, setIntervalRatio] = useState(1.5);
    const [userPitchRatio, setUserPitchratio] = useState(0);
    const [relativeRatio, setRelativeRatio] = useState(0);
    const [csound, setCsound] = useState(null);
    const [soundOn, setSoundOn] = useState(false);
    const [playUpperNoteOn, setPlayUpperNoteOn] = useState(false);
    const [sensitivity, setSensitivity] = useState(0.6);
    const [volume, setVolume] = useState(0.6);
    const [soundType, setSoundType] = useState(2); // 1- sine, 2 -  saw, 3 - square
    const [selectedIntervalRatio, setSelectedIntervalRatio] = useState("1.5"); // perfect fifth is the default

    let channelReadFunction = null;
    //const [started, setStarted] = useState(false);


    useEffect(() => {
        if (csound == null) {
            let audioContext = CsoundObj.CSOUND_AUDIO_CONTEXT;
            console.log("AudioContext: ", typeof(audioContext));
            if ( typeof (audioContext) == "undefined") {
                CsoundObj.initialize().then(() => {
                    const cs = new CsoundObj();
                    console.log("CS:",typeof(cs) );
                    enableAudioInput(cs);
                    setCsound(cs);
                });
            } else { // do not initialize if audio context is already created
                const cs = new CsoundObj();
                enableAudioInput(cs);
                setCsound(cs);
            }
        } else {
            console.log("Csound RESET");
            csound.reset();
        }
        return () => { console.log("cleanup"); stopUpdate();  if (csound) csound.reset();} // tryout against memory leak...
    }, [csound]);

    useEffect(() => {
        document.title = `${ capitalizeFirst( t("tuning") )}`;
    }, []);

    const  enableAudioInput = (cs) => {
        if (!navigator.mediaDevices) {
            alert("The page needs to be served from https or localhost!")
        } else {
            cs.enableAudioInput((res) => {
                if (res) {
                    console.log("Audio Input OK");
                } else {
                    console.log("Audio Input NOT OK!!");
                    alert("This site needs enabled audio input to work.");
                }
            });
        }
    }

    const startCsound = () => {
        csound.compileOrc(orc);
        csound.start();
        csound.audioContext.resume();
    };

    const startTuning = () => {
        if (csound) {
            startUpdateChannels();
            csound.setControlChannel("playUpperNote", 0);
            csound.readScore("i 1 0 -1");
            setPlayUpperNoteOn(false);
            setSoundOn(true);
        }
    };

    const playUpperNote = (event) => {
        const checked = event.target.checked;
        if (csound) {
            if (checked) { // if on, then out
                csound.setControlChannel("playUpperNote", 1);
            } else {
                csound.setControlChannel("playUpperNote", 0);
            }
        }
        setPlayUpperNoteOn(checked);
    }

    const stopTuning = () => {
        if (csound) {
            csound.readScore("i -1 0 0");
        }
        setPlayUpperNoteOn(false);
        setSoundOn(false);
        stopUpdate();
    }

    const stopUpdate = () => {
        if (channelReadFunction) {
            clearInterval(channelReadFunction);
            channelReadFunction = null;
        }
    }

    const startUpdateChannels = () => {
        stopUpdate(); //clearInterval
        channelReadFunction =  setInterval( () => {
            if (csound) {
                csound.requestControlChannel("pitchratio",
                    () => {
                        const value = csound.getControlChannel("pitchratio");
                        setUserPitchratio(value);
                    });
                csound.requestControlChannel("relativeRatio",
                    () => {
                        const value = csound.getControlChannel("relativeRatio");
                        setRelativeRatio(value);
                    });
            }
        }, 100 );
    }




    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        startCsound();
        setExerciseHasBegun(true);
    };


    // UI ======================================================

    const createControlButtons = () => {

        // material UI does not have a toggle button! Use switches instead for now

        return exerciseHasBegun ? (
            <Grid item container  direction={"row"} spacing={1}  alignItems={"center"}>
                <Grid item>
                    <FormControlLabel control={<Switch
                        onChange ={ (e) =>  e.target.checked ? startTuning() : stopTuning()  }
                    />} label={capitalizeFirst(t("playAndTune"))} />
                </Grid>
                <Grid item>
                    <FormControlLabel control={<Switch
                        checked = {playUpperNoteOn}
                        onChange ={ playUpperNote }
                    />} label={capitalizeFirst(t("upperNote"))} />
                </Grid>
            </Grid>
        ) : (
            <Grid item>
                <Button variant="contained"  color={"primary"} onClick={() => startExercise()} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>
            </Grid>
        );
    };

    const createExplanationRow = () => {
        //TODO: translation
        return  exerciseHasBegun ?  (
          <Grid item>
              <Accordion>
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="info-content"
                      id="info-panel"
                  >
                     Info
                  </AccordionSummary>
                  <AccordionDetails>
                      <i>See viis infot kuvada on ajutine!</i>
                      <small>Valige alumine noot ning intervall, mille intoneerimist tahate harjutada.
                          Seejärel vajutage "Mängi ja häälesta".
                          Süsteem mängib intervalli alumise noodi, mängige või laulge ülemist nooti ning püüdke näidikul saavutada sama sageduste suhet, nagu on näidatud suhe vasakul.
                          See vastab valitud puhtale intervallile.
                          Võite vajutada ka "Ülemine noot", et kuulda selle korrektset kõrgust.
                          Võimalusel kasutage kõrvaklappe või sättige helitugevus  ja sisendi tundlikkus sobivaks, et süsteemi mängitud heli liiga mikrofoni ei kostaks.
                      </small>
                  </AccordionDetails>
              </Accordion>
              </Grid>
        ) : null;
    }

   const createOptionsRow = () => {

       //TODO: one selection for note and octave - later break to octave and pitch
       //const notes = [];
       //const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "Bb", "B (H)"];


        const octaveOptions = [
            { text: capitalizeFirst(t("greatOctave")), value: 6}, // octave numbers as in Csound -  middle C is 8.00
            { text: capitalizeFirst(t("smallOctave")), value: 7},
            { text: capitalizeFirst(t("firstOctave")), value: 8},
            { text: capitalizeFirst(t("secondOctave")), value: 9},
        ];

        const noteOptions = [
            { text: "C", value: 0},
            { text: "Cis", value: 1}, // TODO (future): English/Russion naming convention
            { text: "D", value: 2}, // etc
            { text: "Es", value: 3}, { text: "E", value: 4}, { text: "F", value: 5},
            { text: "Fis", value: 6}, { text: "G", value: 7},{ text: "As", value: 8},
            { text: "A", value: 9}, { text: "B", value: 10},{ text: "H", value: 11},
        ];

        return  exerciseHasBegun ?  (
          <Grid item container direction={"row"} spacing={1}  alignItems={"center"}>
              <Grid item>{capitalizeFirst(t("sound"))}:</Grid>
              <Grid item>
                  <Select
                      labelId="soundLabel" id="selectInstrument"
                      value={soundType}
                      onChange={  (event) => {
                          const sound = event.target.value;
                          if (csound) {
                              csound.setControlChannel("sound", sound);
                          }
                          setSoundType(sound);
                      } }

                      disabled={false}
                      placeholder={capitalizeFirst(t("sound"))}
                  >
                      <label id="soundLabel" hidden>{t("sound")}</label>
                      <MenuItem value={1}>{capitalizeFirst(t("sine"))}</MenuItem>
                      <MenuItem value={2}>{capitalizeFirst(t("saw"))}</MenuItem>
                      <MenuItem value={3}>{capitalizeFirst(t("square"))}</MenuItem>
                  </Select>

              </Grid>
              <Grid item>{ `${capitalizeFirst(t("lowerNote"))}: `}</Grid>
              <Grid item>
                  <Select
                      aria-label={t("lowerNote")}
                      placeholder={capitalizeFirst(t("note"))}
                      onChange={ (event) => {
                          if (csound) {
                              csound.setControlChannel("step", event.target.value);
                          }
                      }
                      }
                      defaultValue={0}
                  >
                      {noteOptions.map( note => <MenuItem key={"note"+note.value} value={note.value}>{note.text}</MenuItem> ) }
                  </Select>
              </Grid>
              <Grid item>
                  <Select
                      aria-label={t("octave")}
                      placeholder={capitalizeFirst(t("octave"))}
                      onChange={ (event) => {
                          if (csound) {
                              csound.setControlChannel("octave", event.target.value);
                          }
                      }
                      }
                      defaultValue={8}>
                      {octaveOptions.map( octave => <MenuItem key={"octave"+octave.value} value={octave.value}>{octave.text}</MenuItem> ) }
                  </Select>
              </Grid>
          </Grid>
        ) : null;
    };

   const createFeedbackRow = () => {
       return exerciseHasBegun ? (
           <Grid container direction={"row"} spacing={1} justifyContent={"center"} alignItems={"center"} >
               <Grid item > {` ${capitalizeFirst(t("ratio"))}: ${selectedIntervalRatio} `}</Grid>
               <Grid item>
                   <Meter   level={relativeRatio} />
               </Grid>
               <Grid item>{` ${capitalizeFirst(t("input"))}: ${userPitchRatio.toFixed(2)} `}</Grid>
           </Grid>
       ) : null;
   }



    const createSliderRow = () => {
        return exerciseHasBegun ? (
            <Grid container direction={"row"} spacing={1} justifyContent={"center"} alignItems={"center"}>
                <Grid item>{capitalizeFirst(t("inputSensitivity"))}</Grid>
                <Grid item item xs={2} md={3}>

                    <Slider value={sensitivity}
                            aria-label={t("inputSensitivity")}
                            aria-valuetext={sensitivity.toFixed(2)}
                            min={0} max={1} step={0.01}
                            onChange ={ (event, value) => {
                                if (csound) {
                                    csound.setControlChannel("threshold", value);
                                }
                                setSensitivity(value);
                            } }
                    />

                </Grid>
                <Grid item>{capitalizeFirst(t("volume"))}</Grid>
                <Grid item xs={2} md={3}>
                    <Slider value={volume}
                            aria-label={t("inputSensitivity")}
                            aria-valuetext={sensitivity.toFixed(2)}
                            min={0} max={1} step={0.01}
                            onChange = { (event, value) => {
                                    if (csound) {
                                        csound.setControlChannel("volume", value);
                                    }
                                    setVolume(value);
                                }
                            }
                    />
                </Grid>
                <Grid/>
            </Grid>
        ) : null;
    };


    const setSelectedIntervalFunction = (intervalRatio, active) => {

        if (!active) {
            if (!soundOn) {
                //console.log("I must switch sound on");
                startTuning();
            }
        } else { // the button is on, must be switched out
            if (soundOn) {
                //console.log("I must switch sound off")
                stopTuning();
            }
        }

        if (csound) {
            console.log("Set interval to: ", intervalRatio);
            csound.setControlChannel("interval", intervalRatio);
        }
        setIntervalRatio(intervalRatio);
    }

    const createIntervalSelection = () => {
       // TODO: something like checked for defualt interval (p5)
        return exerciseHasBegun ? (
            <>
            <Grid item container direction={"row"} spacing={1}>

                {/*<FormControl component="fieldset">*/}
                    <FormLabel component="legend">{capitalizeFirst(t("interval"))}</FormLabel>

                    <RadioGroup row aria-label={t("intervalSelection")} name="intervalSelection"
                                value={selectedIntervalRatio}
                                onChange={ (e) => {
                                    const newValue = e.target.value;
                                    console.log("new ratio: ", newValue);
                                    if (csound) {
                                        csound.setControlChannel("interval", parseFloat(newValue));
                                    }
                                    setSelectedIntervalRatio( newValue);

                                }}
                    >
                        {/*values mut be as strings here...*/}
                        <FormControlLabel value={"1.125"} control={<Radio />} label={"s2"} />

                        <FormControlLabel  value={"1.2"} control={<Radio />} label={"v3"} />
                        <FormControlLabel value={"1.25"} control={<Radio />} label={"s3"} />
                        <FormControlLabel value={"1.3333"} control={<Radio />}  label={"p4"} />
                        <FormControlLabel value={"1.5"} control={<Radio />} label={"p5"} />
                        <FormControlLabel value={"1.6"} control={<Radio />} label={"v6"} />

                        <FormControlLabel value={"1.6666"} control={<Radio />} label={"s6"} />
                        <FormControlLabel value={"1.75"} control={<Radio />} label={"v7 7/4"} />
                        <FormControlLabel value={"1.8"} control={<Radio />} label={"v7 9/5"} />
                        <FormControlLabel value={"1.875"} control={<Radio />} label={"s7"} />
                        <FormControlLabel value={"2"} control={<Radio />} label={"p8"} />


                    </RadioGroup>
                {/*</FormControl>*/}
            </Grid>

                </>
        ) : null;
    }



    return (
        <div>
            <h2 size='large'>{ `${ capitalizeFirst(t("tuneInterval"))} ` }</h2>

            { csound == null ? (
                <header className="App-header">
                    <p>Loading...</p>
                </header>
            ) : (

            <Grid container direction={"column"} spacing={1}>
                {createExplanationRow()}
                {createOptionsRow()}
                {createFeedbackRow()}
                {createSliderRow()}
                {createIntervalSelection()}
                {createControlButtons()}

                <Grid item>
                        <GoBackToMainMenuBtn/>
                </Grid>
            </Grid>
                )}
        </div>

    );
};



export default AskTuning;


// the code is based from example here by Adam Mark
// https://github.com/bmorelli25/react-svg-meter/blob/master/src/Meter.js
const  Meter = (props) => {
    let {
        level = 0,         // a number between 0 and 1, inclusive
        width = 20,         // the overall width
        height = 80,         // the overall height
        rounded = false,      // if true, use rounded corners
        //color = "#0078bc",   // the fill color
        animate = true,     // if true, animate when the percent changes
        label = null         // a label to describe the contents (for accessibility)
    } = props;

    const r = rounded ? Math.ceil(width / 4) : 0;
    const h = level ? Math.max(width, height * Math.min(level, 1)) : 0; // this is probably wrong, see
    const style = animate ? { "transition": "width 100ms, fill 500ms" } : null;
    let varyColor = "#0078bc";
    if (level < 0.3 || level >=0.7  ) {
        varyColor = "red";
    } else if ( (level >= 0.3 && level <0.45) || (level >= 0.55 && level <0.7)   ) {
        varyColor = "yellow";
    } else { // is it foolproof? should be 0.45..0.54
        varyColor = "green"
    }

    return (
        <svg width={width} height={height} aria-label={label}>
            <rect   width={width} height={height} fill="#ccc" rx={r} ry={r}/>
            <rect width={width} height={h} y={height-h} fill={varyColor} rx={r} ry={r} style={style}/>
        </svg>
    );
};