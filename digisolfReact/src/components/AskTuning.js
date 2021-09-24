import React, { useState, useEffect } from 'react';
import {Dropdown} from 'semantic-ui-react'
import {Button, ButtonGroup, Grid, Select, MenuItem} from '@material-ui/core';
import {useTranslation} from "react-i18next";
import {capitalizeFirst} from "../util/util";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import CsoundObj from "@kunstmusik/csound";
import  {tuningOrchestra as orc} from "../csound/orchestras";
import { Slider } from "react-semantic-ui-range";
import {setInstrument} from "../actions/exercise";


// NB!!!! start with  export HOST="localhost" ; npm start for local testing, with other hostnames sound input does not work

const AskTuning = () => {
    const { t, i18n } = useTranslation();


    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [intervalRatio, setIntervalRatio] = useState(1.5);
    const [userPitchRatio, setUserPitchratio] = useState(0);
    const [relativeRatio, setRelativeRatio] = useState(0);
    const [csound, setCsound] = useState(null);
    const [soundOn, setSoundOn] = useState(false);
    const [playIntervalOn, setPlayIntervalOn] = useState(false);
    const [sensitivity, setSensitivity] = useState(0.6);
    const [volume, setVolume] = useState(0.6);
    const [soundType, setSoundType] = useState(2); // 1- sine, 2 -  saw, 3 - square

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
            csound.setControlChannel("playInterval", 0);
            csound.readScore("i 1 0 -1");
            setPlayIntervalOn(false);
            setSoundOn(true);
        }
    };

    const playInterval = (event, data) => {
        if (csound) {
            if (playIntervalOn) { // if on, then out
                csound.setControlChannel("playInterval", 0);
            } else {
                csound.setControlChannel("playInterval", 1);
            }
        }
        setPlayIntervalOn(!playIntervalOn);
    }

    const stopTuning = () => {
        if (csound) {
            csound.readScore("i -1 0 0");
        }
        setPlayIntervalOn(false);
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

    const createPlaySoundButton = () => {

        return exerciseHasBegun ? null : (
            <Grid item>
                <Button variant="contained"  color={"primary"} onClick={() => startExercise()} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>
            </Grid>
        );
    };


   const createOptionsRow = () => {

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

                      disabled={true}
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
           <Grid container direction={"row"} spacing={1} justifyContent={"center"} alignContent={"center"} >
               <Grid item  verticalAlign={"middle"}> {` ${capitalizeFirst(t("ratio"))}: ${intervalRatio.toFixed(2)} `}</Grid>
               <Grid item>
                   <Meter   level={relativeRatio} />
               </Grid>
               <Grid item verticalAlign={"middle"}>{` ${capitalizeFirst(t("input"))}: ${userPitchRatio.toFixed(2)} `}</Grid>
           </Grid>
       ) : null;
   }


    const handleSliderChange = (value) => {
       if (csound) {
           csound.setControlChannel("threshold", value);
       }
       //console.log("Slider value:", value);
       setSensitivity(value);
   }


    const createSliderRow = () => {
        return exerciseHasBegun ? (
            <Grid container direction={"row"} spacing={1}>
                <Grid item>
                    {capitalizeFirst(t("inputSensitivity"))}
                    <Slider value={sensitivity} color="blue"
                            settings={ {
                                min:0, max:1, step:0.01,
                                start: {sensitivity},
                                onChange: handleSliderChange
                            } }
                    />

                </Grid>
                <Grid item>
                    {capitalizeFirst(t("volume"))}
                    <Slider value={volume} color="blue"
                            settings={ {
                                min:0, max:1, step:0.01,
                                start: {volume},
                                onChange: (value) => {
                                    if (csound) {
                                        csound.setControlChannel("volume", value);
                                    }
                                    setVolume(value);
                                }
                            } }
                    />
                </Grid>
                <Grid/>
            </Grid>
        ) : null;
    };

   // TODO: connetc this code and tune somhow
    const setSelectedInterval = (intervalRatio, active) => {

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

    const createIntervals = () => {
       // TODO: something like checked for defualt interval (p5)
        return exerciseHasBegun ? (
            <>
            <Grid item container direction={"row"} spacing={1}>
                <ButtonGroup toggle={true} aria-label={"intervalSelection"} >
                    <Button variant="contained"  active={intervalRatio === 9/8 && soundOn}  onClick={ (event, data) => setSelectedInterval(9/8,data.active) }>s2</Button>
                    <Button variant="contained"  active={intervalRatio === 6/5 && soundOn}  onClick={ (event, data) => setSelectedInterval(6/5,data.active) }>v3</Button>
                    <Button variant="contained"  active={intervalRatio === 5/4 && soundOn}  onClick={ (event, data) => setSelectedInterval(5/4,data.active) }>s3</Button>

                    <Button variant="contained"   active={intervalRatio === 4/3 && soundOn}  onClick={ (event, data) => setSelectedInterval(4/3,data.active) }>p4</Button>
                    <Button variant="contained"   active={intervalRatio === 3/2 && soundOn}  onClick={ (event, data) => setSelectedInterval(3/2,data.active) }>p5</Button>
                    <Button variant="contained"   active={intervalRatio === 8/5 && soundOn}  onClick={ (event, data) => setSelectedInterval(8/5,data.active) }>v6</Button>
                </ButtonGroup>
            </Grid>
            <Grid item container direction={"row"} spacing={1}>
                <ButtonGroup variant="contained" >
                    <Button variant="contained"   active={intervalRatio === 5/3 && soundOn}  onClick={ (event, data) => setSelectedInterval(5/3,data.active) }>s6</Button>
                    <Button variant="contained"   active={intervalRatio === 7/4 && soundOn}  onClick={ (event, data) => setSelectedInterval(7/4,data.active) }>v7 7/4</Button>
                    <Button variant="contained"   active={intervalRatio === 9/5 && soundOn}  onClick={ (event, data) => setSelectedInterval(9/5,data.active) }>v7 9/5</Button>
                    <Button variant="contained"   active={intervalRatio === 15/8 && soundOn}  onClick={ (event, data) => setSelectedInterval(15/8,data.active) }>s7 </Button>
                    <Button variant="contained"   active={intervalRatio === 2 && soundOn}  onClick={ (event, data) => setSelectedInterval(2,data.active) }>p8 </Button>
                </ButtonGroup>


            </Grid>
                <Grid item>
                    <Button variant="contained"  toggle={true} onClick={playInterval}>{t("upperNote")}</Button>
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
                {createOptionsRow()}
                {/*{createFeedbackRow()}
                {createSliderRow()}
                {createIntervals()}*/}
                {createPlaySoundButton()}

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