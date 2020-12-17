import React, { useState, useEffect } from 'react';
import {Button, Grid, Header, Dropdown} from 'semantic-ui-react'
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {capitalizeFirst} from "../util/util";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import {useParams} from "react-router-dom";
import CsoundObj from "@kunstmusik/csound";
import  {tuningOrchestra as orc} from "../csound/orchestras";
import { Slider } from "react-semantic-ui-range";


// NB!!!! start with  export HOST="localhost" ; npm start for local testing, with other hostnames sound input does not work

const AskTuning = () => {
    const { name } = useParams();


    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();


    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [intervalRatio, setIntervalRatio] = useState(1.5);
    const [userPitchRatio, setUserPitchratio] = useState(0);
    const [relativeRatio, setRelativeRatio] = useState(0);
    const [csound, setCsound] = useState(null);
    const [soundOn, setSoundOn] = useState(false);
    const [playIntervalOn, setPlayIntervalOn] = useState(false);

    let channelReadFunction = null;
    //const [started, setStarted] = useState(false);


    useEffect(() => {
        if (csound == null) {
            let audioContext = CsoundObj.CSOUND_AUDIO_CONTEXT;
            if ( typeof (audioContext) == "undefined") {
                CsoundObj.initialize().then(() => {
                    const cs = new CsoundObj();
                    //console.log("CsoundObj: ", cs);

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
                    setCsound(cs);
                });
            } else { // do not initialize if audio context is already created
                const cs = new CsoundObj();
                setCsound(cs);
            }
        } else {
            console.log("Csound RESET");
            csound.reset();
        }
    }, [csound]);


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
            /*if ( !soundOn ) {
                startUpdateChannels();
                csound.setControlChannel("playInterval", 0);
                csound.readScore("i 1 0 -1");
            } else {
                startUpdateChannels();
                csound.setControlChannel("playInterval", 0);
                csound.readScore("i -1 0 0");
                setPlayIntervalOn(false);
            }*/
        }
        //setSoundOn(!soundOn);
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
                        const value = csound.getControlChannel("pitchratio");
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

        if (exerciseHasBegun) {
            return (
                <Grid.Row  columns={3} centered={true}>
                    <Grid.Column>
                        <Button toggle={true} onClick={startTuning} className={"fullWidth marginTopSmall"}  >{t("tune")}</Button>
                    </Grid.Column>
                    {/*<Grid.Column>
                        <Button onClick={stop} className={"fullWidth marginTopSmall"}  >{t("stop")}</Button>
                    </Grid.Column>*/}
                    <Grid.Column>
                        <Button toggle={true} onClick={playInterval} className={"fullWidth marginTopSmall"}  >{t("upper Note")}</Button>
                    </Grid.Column>
                </Grid.Row>

            );
        } else {
            return(
                <Grid.Row  >
                    <Grid.Column>
                    <Button color={"green"} onClick={() => startExercise()} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>
                    </Grid.Column>
                </Grid.Row>
            );
        }
    };


   const createOptionsRow = () => {
        const soundOptions = [
            { text: capitalizeFirst(t("sine")), value: 1},
            { text: capitalizeFirst(t("saw")), value: 2},
            { text: capitalizeFirst(t("square")), value: 3},
        ];
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
        ];
        return  exerciseHasBegun ?  (
          <Grid.Row columns={5}>
              <Grid.Column> { `${capitalizeFirst(t("sound"))}: `} </Grid.Column>
              <Grid.Column>
                  <Dropdown
                      placeholder={capitalizeFirst(t("sound"))}
                      onChange={ (event, data) => {
                          //console.log("on change follower", data.value);
                          if (csound) {
                              csound.setControlChannel("sound", data.value);
                          }
                      } }
                      options ={soundOptions}
                      defaultValue={2}
                  />
              </Grid.Column>
              <Grid.Column>{ `${capitalizeFirst(t("lowerNote"))}: `}</Grid.Column>
              <Grid.Column>
                  <Dropdown
                      placeholder={capitalizeFirst(t("octave"))}
                      onChange={ (event, data) => {
                          // console.log("on change follower", data.value);
                          //setOctave(data.value);
                          if (csound) {
                              csound.setControlChannel("octave", data.value);
                          }
                        }
                      }
                      options ={octaveOptions}
                      defaultValue={8}
                  />
              </Grid.Column>
              <Grid.Column>
                  <Dropdown
                      placeholder={capitalizeFirst(t("note"))}
                      onChange={ (event, data) => {
                          // console.log("on change follower", data.value);
                          //setBaseNote(data.value);
                          if (csound) {
                              csound.setControlChannel("step", data.value);
                          }
                      }
                      }
                      options ={noteOptions}
                      defaultValue={0}
                  />
              </Grid.Column>
          </Grid.Row>
        ) : null;
    };

   const createFeedbackRow = () => {
       return exerciseHasBegun ? (
           <Grid.Row centered={true}>
               <Grid.Column></Grid.Column>
               <Grid.Column>
                   {` ${capitalizeFirst(t("ratio"))}: ${intervalRatio} `}
                   <Meter level={relativeRatio} />
                   {` ${capitalizeFirst(t("input"))}: ${userPitchRatio.toFixed(2)} `}
               </Grid.Column>
               <Grid.Column></Grid.Column>

           </Grid.Row>
       ) : null;
   }

    const [sensitivity, setSensitivity] = useState(0.5);

    const settings = {
        start: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: value => {
            console.log("Slider value:", value);
        }
    };

   const handleSliderChange = (value) => {
       if (csound) {
           csound.setControlChannel("threshold", value);
       }
       //console.log("Slider value:", value);
       setSensitivity(value);
   }

   const createInputSensitivityRow = () => {
       return exerciseHasBegun ? (
           <Grid.Row centered={true} columns={3}>
               <Grid.Column />
               <Grid.Column>
                   {capitalizeFirst(t("inputSensitivity"))}
                   <Slider value={sensitivity} color="blue"
                           settings={ {
                               min:0, max:1, step:0.01,
                               start: {sensitivity},
                               onChange: handleSliderChange
                           } }
                   />
               </Grid.Column>
               <Grid.Column />
           </Grid.Row>
       ) : null;
   };

   // TODO: connetc this code and tune somhow
    const setSelectedInterval = (intervalRatio, active) => {

        if (!active) {
            if (!soundOn) {
                console.log("I must switch sound on");
                startTuning();
            }
        } else { // the button is on, must be switched out
            if (soundOn) {
                console.log("I must switch sound off")
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
            <Grid.Row centered={true}>
                <Button.Group toggle={true} >
                    <Button active={intervalRatio === 9/8 && soundOn}  onClick={ (event, data) => setSelectedInterval(9/8,data.active) }>s2</Button>
                    <Button active={intervalRatio === 6/5 && soundOn}  onClick={ (event, data) => setSelectedInterval(6/5,data.active) }>v3</Button>
                    <Button active={intervalRatio === 5/4 && soundOn}  onClick={ (event, data) => setSelectedInterval(5/4,data.active) }>s3</Button>


                    {/*<Button  onClick={ () => setSelectedInterval(6/5) }>v3</Button>

                    <Button  onClick={ () => setSelectedInterval(5/4) }>s3</Button>*/}
                    <Button  active={intervalRatio === 4/3 && soundOn}  onClick={ (event, data) => setSelectedInterval(4/3,data.active) }>p4</Button>
                    <Button  active={intervalRatio === 3/2 && soundOn}  onClick={ (event, data) => setSelectedInterval(3/2,data.active) }>p5</Button>
                    <Button  active={intervalRatio === 8/5 && soundOn}  onClick={ (event, data) => setSelectedInterval(8/5,data.active) }>v6</Button>
                </Button.Group>
            </Grid.Row>
            <Grid.Row centered={true}>
                <Button.Group toggle={true} >
                    <Button  active={intervalRatio === 5/3 && soundOn}  onClick={ (event, data) => setSelectedInterval(5/3,data.active) }>s6</Button>
                    <Button  active={intervalRatio === 7/4 && soundOn}  onClick={ (event, data) => setSelectedInterval(7/4,data.active) }>v7 7/4</Button>
                    <Button  active={intervalRatio === 9/5 && soundOn}  onClick={ (event, data) => setSelectedInterval(9/5,data.active) }>v7 9/5</Button>
                    <Button  active={intervalRatio === 15/8 && soundOn}  onClick={ (event, data) => setSelectedInterval(15/8,data.active) }>s7 </Button>
                    <Button  active={intervalRatio === 2 && soundOn}  onClick={ (event, data) => setSelectedInterval(2,data.active) }>p8 </Button>
                </Button.Group>
            </Grid.Row>
                </>
        ) : null;
    }



    return (
        <div>
            <Header size='large'>{ `${ capitalizeFirst(t("tuneInterval"))} ` }</Header>

            { csound == null ? (
                <header className="App-header">
                    <p>Loading...</p>
                </header>
            ) : (

            <Grid>
                {createOptionsRow()}
                {createFeedbackRow()}
                {createInputSensitivityRow()}
                {createIntervals()}
                {createPlaySoundButton()}

                <Grid.Row>
                    <Grid.Column>

                        <GoBackToMainMenuBtn/>
                    </Grid.Column>
                </Grid.Row>
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
        width = 30,         // the overall width
        height = 100,         // the overall height
        rounded = false,      // if true, use rounded corners
        color = "#0078bc",   // the fill color
        animate = false,     // if true, animate when the percent changes
        label = null         // a label to describe the contents (for accessibility)
    } = props;

    const r = rounded ? Math.ceil(width / 4) : 0;
    const h = level ? Math.max(width, height * Math.min(level, 1)) : 0; // this is probably wrong, see
    const style = animate ? { "transition": "width 500ms, fill 250ms" } : null;
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