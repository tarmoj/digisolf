import React, {useState, useEffect, useRef} from 'react';
import {
    Button,
    ButtonGroup,
    IconButton,
    MenuItem,
    Popover,
    Select,
    Grid,
    TableContainer,
    TableBody, Table, TableRow, TableCell, TableHead
} from "@material-ui/core"

import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {capitalizeFirst} from "../util/util";

import {setNegativeMessage, setPositiveMessage} from "../actions/headerMessage";
import ScoreRow from "./ScoreRow";
//import Notation from "../notation/Notation";
import {dictations} from "../dictations/functional"
import {incrementCorrectAnswers, incrementIncorrectAnswers} from "../actions/score";
import GoBackToMainMenuBtn from "./GoBackToMainMenuBtn";
import Sound from 'react-sound';
import {useParams} from "react-router-dom";
import VolumeRow from "./VolumeRow";
import {NavigateBefore, NavigateNext} from "@material-ui/icons";
import {TableHeader} from "material-ui";


const AskFunctions = () => {
    const { title } = useParams();

    const getTitleIndex = () => {
        let index = -1;
        if (title && dictations) {
            //find index of that dictation
            index = dictations.findIndex( element => {
                if (element.title === title) {
                    return true;
                }
            });
            //console.log("was able to find index for ", title, index);
        }
        return index;
    }

    const titleIndex = getTitleIndex();

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const [exerciseHasBegun, setExerciseHasBegun] = useState(false);
    const [selectedDictation, setSelectedDictation] = useState(dictations[titleIndex >=0 ? titleIndex : 0 ]);
    const [dictationIndex, setDictationIndex] = useState(titleIndex >= 0 ? titleIndex  : 0);
    const [answer, setAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [response, setResponse] = useState([]); //array of string like "T", "S, "D"
    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
    const [volume, setVolume] = useState(0.6);
    const [activeFunctionBoxIndex, setActiveFunctionBoxIndex] = useState(0);


    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    });



    // EXERCISE LOGIC ======================================

    const startExercise = () => {
        setExerciseHasBegun(true);

        if (titleIndex >= 0 ) {
            setDictationIndex(titleIndex);
            renew(titleIndex);
        } else {
            renew(0);
        }

    };


    const renew = (dictationIndex) => {
        console.log("Renew: ", dictationIndex);
        setAnswered(false);

        const dictation = dictations[dictationIndex];
        setSelectedDictation(dictation);
        const answer = dictation.functions.flat(); // array of cuntions
        setAnswer(answer);
        setActiveFunctionBoxIndex(0);
        setResponse(Array(answer.length).fill("--")); // cannot be empty array, otherwise clears response on every new render

        if (exerciseHasBegun) {
            play();
        }

    };


    const play = () => {
        stop(); // need a stop here  - take care, that it does not kill already started event
        setPlayStatus(Sound.status.PLAYING);
    };

    const stop = () => {
        // console.log("***Stop***");
        setPlayStatus(Sound.status.STOPPED);
    };

    const checkResponse = () => { // response is an object {key: value [, key2: value, ...]}

        if (!exerciseHasBegun) {
            alert(t("pressStartExsercise"));
            return;
        }

        if (!selectedDictation.title ) {
            alert( t("chooseDictation"));
            return;
        }
        
        if (answered) {
            alert(t("alreadyAnswered"));
            return;
        }

        setAnswered(true);
        let correct = true;

        console.log("checkResponse answer: ", answer);

        for (let i=0; i<answer.length; i++) {
            if (response[i]==answer[i]) {
                console.log("Correct! ", i, response[i]);
            } else {
                console.log(response[i], " is wrong!  Should be: ", answer[i]);
                correct = false;
            }
        }

        if ( correct ) {
            //dispatch(setPositiveMessage(feedBack, 5000));
            dispatch(incrementCorrectAnswers());
        } else {
            //dispatch(setNegativeMessage(feedBack, 5000));
            dispatch(incrementIncorrectAnswers());
        }

    };




    // UI ======================================================

    const createControlButtons = () => {

        if (exerciseHasBegun) {
            return  (
                <Grid item container spacing={1} direction={"row"} className={"exerciseRow"}>
                    <Grid item>
                        <Button variant="contained" color={"primary"} onClick={() => play(selectedDictation)} className={"fullWidth marginTopSmall"} >
                            { capitalizeFirst( t("play")) }
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={() => stop()} className={"fullWidth marginTopSmall"}  >{ capitalizeFirst( t("stop") )}</Button>
                    </Grid>
                   <Grid item>
                         <Button variant="contained" className={"fullWidth marginTopSmall"}
                                onClick={() => checkResponse(null)}>{capitalizeFirst(t("check"))}
                        </Button>
                    </Grid>
                </Grid>
            );
        } else {
            return(
                <Grid item  >
                    <Button variant="contained" color={"primary"} onClick={startExercise} className={"fullWidth marginTopSmall"}>{t("startExercise")}</Button>
                </Grid>
            );
        }
    };


    const handleIndexChange = (change = 1) => { // change can be positive or negative
        let newIndex = dictationIndex + change;
        if (newIndex>dictations.length-1) newIndex = dictations.length-1;
        if (newIndex<0) newIndex = 0;
        //console.log("dictationIndex is now: ", newIndex);
        setDictationIndex(newIndex);
        renew(newIndex);
    }

    const createSelectionMenu = () => {
        // const options = [];
        //
        // for (let i=0; i< dictations.length; i++) {
        //         options.push( { value: i, text: dictations[i].title  } );
        // }

        return  exerciseHasBegun &&  (
            <Grid item container spacing={1} direction={"row"} justifyContent={"center"} >
                <Grid item>
                    <IconButton aria-label={t("previous")}
                            className={"floatRight"}  onClick={ () => handleIndexChange(-1)}>
                    <NavigateBefore />
                    </IconButton>
                </Grid>
                <Grid item>
                  <label id="label" hidden>{t("chooseDictation")}</label>
                  <Select
                        style={{ width:"100%", minWidth:"20px"  }}
                        labelId="label"
                        placeholder={t("chooseDictation")}
                        value={dictationIndex}
                        onChange={(e)  => {
                            const index = e.target.value;
                            setDictationIndex(index);
                            renew(index);
                        }
                        }
                  >
                      { dictations.map( (dict,i) => (
                          <MenuItem key={"entry"+i} value={i}>{dict.title}</MenuItem>
                      )) }
                  </Select>
                </Grid>

                <Grid item>
                    <IconButton aria-label={t("next")}
                                className={"floatLeft"}  onClick={ () => handleIndexChange(1)}
                    >
                        <NavigateNext/>
                    </IconButton>
                </Grid>
            </Grid>
        );

    } ;

    const onKeyDown = (e) => {
        console.log("Key: ", e.key);
        if (e.key.toString().toLowerCase() === "t") {
            handleFunctionChange(activeFunctionBoxIndex, "T");
        } else if (e.key.toString().toLowerCase() === "d") {
            handleFunctionChange(activeFunctionBoxIndex, "D");
        } else if (e.key === "ArrowRight") {
            if (activeFunctionBoxIndex < response.length-1) setActiveFunctionBoxIndex(activeFunctionBoxIndex+1);
        } else if (e.key === "ArrowLeft") {
            if (activeFunctionBoxIndex > 0) setActiveFunctionBoxIndex(activeFunctionBoxIndex-1);
        } else if (e.key === "Enter") {
            checkResponse();
        }
    };

    const handleFunctionChange = (index, value) => {
        let r = response.slice();
        if (r.length>index) {
            r[index] = value;
            setResponse(r); 
            console.log("Setting response: ", index, response);
            if (activeFunctionBoxIndex < response.length-1) {
                setActiveFunctionBoxIndex(activeFunctionBoxIndex+1);
            }
        }
    }


    /*const FunctionBox = (props) => {
        // good for visible impaired, for touch screens all buttons visible is better
        const index = props.index;
        const functionOptions = [
            { key: 'none', text: '--', value: '--'},
            { key: 'T', text: 'T', value: 'T'},
            { key: 'S', text: 'S', value: 'S'},
            { key: 'D', text: 'D', value: 'D'},
            { key: 'M', text: 'M', value: 'M'}
        ];
        return (
            <React.Fragment>
            <Dropdown
                options={functionOptions}
                className={  answered ?  (answer[index]===response[index] ? "green" : "red")  : ""  }
                style = { {marginLeft:2, marginRight:2}}
                defaultValue={response[index] ? response[index] : "--"}
                onChange={ (event, data) => {
                    handleFunctionChange(index, data.value)
                }
                }
            />
            </React.Fragment>
        );
    }*/

    
    const FunctionBox2 = (props) => {
        const index = props.index ? props.index : 0;
        //const label = response[index] ? response[index] : "?";
        const [show, setShow] = useState(false);
        //TODO: create somewhere styles with classNames: correct wrong hint
        const openerRef = useRef(null);
        console.log("creating Functionbox2 ", index);
        return (
            <React.Fragment>
                <Button id={"opener"}
                    key={"opener"+index}
                    size={"small"}
                    ref={openerRef}
                    variant={index===activeFunctionBoxIndex ? "contained" : "outlined"}
                        style = {{ backgroundColor :   answered ?  (answer[index]===response[index] ? "green" : "red")  : ""   }}
                        onClick = { () => {/*setActiveFunctionBoxIndex(index);*/ setShow(!show); } }
                >{response[index]}</Button>
                <Popover open={show} onClose={ ()=>setShow(false)}
                         key={"popover"+index}
                         anchorEl={openerRef.current}
                         anchorOrigin={{
                             vertical: 'bottom',
                             horizontal: 'center',
                         }}
                         transformOrigin={{
                             vertical: 'top',
                             horizontal: 'center',
                         }}
                >
                    <ButtonGroup variant={"text"} aria-label={t("chooseFunction")} key={"buttonGroup"+index}>
                        <Button variant="contained"
                                key={"T_button"+index}
                                onClick={ (event, data) =>
                                    handleFunctionChange(index,"T", true) }
                        >T</Button>
                        <Button variant="contained"
                                key={"S_button"+index}
                                onClick={ () =>
                                    handleFunctionChange(index,"S", true) }
                        >S</Button>
                        <Button variant="contained"
                                key={"D_button"+index}
                                onClick={ () =>
                                    handleFunctionChange(index,"D", true) }
                        >D</Button>
                        <Button variant="contained"
                                key={"M_button"+index}
                                onClick={ () =>
                                    handleFunctionChange(index,"M", true) }
                        >M</Button>
                    </ButtonGroup>


                </Popover>
            </React.Fragment>
        );
    }

    // const createResponseBlock = () => {
    //     let index = 0;
    //     let elements = [];
    //
    //     for (let measure of selectedDictation.functions ) {
    //         for (let f of measure ) {
    //             elements.push(<FunctionBox index={index} key={"FBox1"+index}/>);
    //             index++;
    //         }
    //         elements.push(" | ");
    //     }
    //
    //     return exerciseHasBegun &&  selectedDictation.title && (
    //         <div className={"marginLeft"}>
    //             <span className={"marginLeft marginRight"}>{capitalizeFirst(t("enterFunctions"))}: </span>
    //             { elements }
    //         </div>
    //     );
    // }

    const createResponseBlock2 = () => {
        let index = 0;
        let elements = [];

        // break functions into subarrays of 4 measures each
        const functions = selectedDictation.functions.slice();

        const functionsByMeasures = [];
        while (functions.length) {
            functionsByMeasures.push( functions.splice(0,4) );

        }

        // for (let measure of selectedDictation.functions ) {
        //
        //     //elements.push(<TableRow>);
        //     for (let f of measure ) {
        //         elements.push(<FunctionBox2 index={index} key={"FBox2"+index} />);
        //         index++;
        //     }
        //     elements.push(" | ");
        //     //if (measureCounter%4==0) elements.push(elements.push(<br>);
        //     measureCounter++;
        //
        // }


        return exerciseHasBegun &&  selectedDictation.title && (
            // <div className={"marginLeft"}>
            //     <span className={"marginLeft marginRight"}>{capitalizeFirst(t("enterFunctions"))}: </span>
            //     { elements }
            //     </div>

            <TableContainer>
                <Table aria-label={t("functionButtons")}>
                    <TableHead>{capitalizeFirst(t("enterFunctions"))}</TableHead>
                    <TableBody>
                        {
                            functionsByMeasures.map( row => (
                                <TableRow>
                                    {row.map(measure => (
                                            <TableCell>
                                                {measure.map( () => {return <FunctionBox2 index={index} key={"FBox2" + index++}/> }
                                                    )}
                                            </TableCell>
                                        )
                                    )
                                    }
                                </TableRow>
                                        )
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    const createCorrectAnswerBlock = () => {
        let functionsString = "";
        for (let measure of selectedDictation.functions ) {
            for (let f of measure ) {
                functionsString += " " + f + " ";
            }
            functionsString += " | ";
        }

        return exerciseHasBegun &&  answered && (
            <div className={"marginLeft"}>
                <span className={"marginLeft marginRight"}>
                    {capitalizeFirst(t("correctAnswerIs"))}: {functionsString}
                </span>
            </div>
        );
    }

    //TODO: show credits (vt askDictation
    return (
        <div>
            <h2 size='large'>{`${capitalizeFirst( t("functions") )} ${selectedDictation.title} `}</h2>

            <Sound
                url={process.env.PUBLIC_URL + selectedDictation.soundFile}
                volume={volume*100}
                loop={false}
                playStatus={playStatus}

                onFinishedPlaying={()=>stop()}

            />


            <Grid container spacing={1} direction={"column"}>
                <ScoreRow/>
                {createSelectionMenu()}
                {/*{createResponseBlock()} - chekcboxes, other is buttons */}
                {createResponseBlock2()}
                {createCorrectAnswerBlock()}
                { exerciseHasBegun && <VolumeRow /> }
                {createControlButtons()}
                <Grid item>
                        <GoBackToMainMenuBtn/>
                </Grid>
            </Grid>
        </div>

    );
};

export default AskFunctions;