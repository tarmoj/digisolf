// plays a perfect interval -  whetrher fourth (4/3), fifth (3/2) or octave (2/1) that may be in tune, low on high
// the possible error is given in cents. If cents = 0, take a random amount of cents;
// type -  harmonic|melodic, deviation -  deviation in cents
function intonation(type = "harmonic",  instrument = "beep", cents = 0, containerNode = document.body, canvasClassName = "mainCanvas") {  // clef and direction not needed for now

    const possibleDeviations = [5, 10, 20, 30];
    let deviationAmount =  (cents === 0) ? getRandomElementFromArray(possibleDeviations) : cents; // the number of cents the interval can be wrong
    let deviation = 0;
    let midiNote = 60;
    const possibleIntervals = [4/3, 3/2, 1];





    // set necessary methods in exercise
    const exercise = new MusicExercise(containerNode, canvasClassName, 150,10,10,1.5); // bigger scale for note input
    //exercise.timeToThink = 30; // more time for doing the test


    // Create or set necessary HTML elements
    containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Häälestus.";
    containerNode.getElementsByClassName("description")[0].innerHTML = '<button onclick"startCsound();">Csound</button>';
    containerNode.getElementsByClassName("question")[0].innerHTML = "Kas intervall on puhas, kitsas või lai?";




    //containerNode.getElementsByClassName("replyButton")[0].style.visibility = "hidden";
    //containerNode.getElementsByClassName("question")[0].style.visibility = "hidden";

    exercise.generate = function() { // set the deviation - negative, 0, or positive
        const random = Math.random()*3;
        if (random < 1) {
            deviation = -deviationAmount;
        } else if (random > 2) {
            deviation = deviationAmount;
        } else {
            deviation = 0;
        }

        midiNote = getRandomInt(60, 72);
    };

    exercise.renew = function() {
        exercise.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
        exercise.play();
    };

    exercise.play = function() { // use Csound to play the inetrval
        if (csound !== undefined) {
            csound.inputMessage('i 1 0 2 0.1 67 1.3333333 -20 3 1');
        }

    };

    exercise.responseFunction = function() {
        exercise.attempts += 1;
        let answer = containerNode.getElementsByClassName("answer")[0].value.trim();

        let feedback = "";
/*
        if (intervalData.interval.shortName === answer) {  // NB! this is not fool proof!!! test!
            feedback += "<b>Intervall õige! </b>";
            exercise.score += 1;
        } else {
            feedback += "<b>Vale.</b> Mängitud intervall on: <b>" + intervalData.interval.longName + "  (" + intervalData.interval.shortName + ")</b>";
        }

        containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
        containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
        containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback;

        if (exercise.testIsRunning) { // add info to test report
            exercise.testReport +=  exercise.currentQuestion.toString() +  '. Mängitud intervall: ' + intervalData.interval.shortName + '. Sisestatud intervall: ' + answer;
            exercise.testReport += ".<br>Tagasiside: " + feedback + "<br>";
        }

 */
    };

    // initialize csound
    // <script src="https://github.com/hlolli/csound-wasm/releases/download/6.12.0-5/csound-wasm-browser.js">  or ext/csound-was-browser must be loaded

    exercise.startCsound = function() {

        const csoundOrchestra = `
giSine ftgen 1,0, 16384, 10, 1 ; Sine
giSawtooth ftgen 2,0,  16384, 10, 1, 0.5, 0.3, 0.25, 0.2, 0.167, 0.14, 0.125, .111   ; Sawtooth
giSquare ftgen 3,  0, 16384, 10, 1, 0,   0.3, 0,    0.2, 0,     0.14, 0,     .111   ; Square

instr PlayInterval
	iAmp = (p4==0) ? 0.3 : p4
	iFreq1 = cpsmidinn(p5) ; pich given as midi note
	iIntervalRatio = p6 ; frequency ratio from base note 1.5 - perfect fifth etc
	iCents = p7 ; deviation in cents, positive or negative 
	iFreq2 = iFreq1 * iIntervalRatio * cent(iCents)
	iSoundType = p8
	iPlayMelodic = p9
	iTable = (iSoundType >0 && iSoundType <=3) ? iSoundType : 1 
	
	iStart2 = (iPlayMelodic>0) ? p3 : 0
	
	; think how to use samples of instruments
	iInstrument = nstrnum("Beep")
	
	schedule iInstrument, 0, p3, iAmp, iFreq1, iTable
	schedule iInstrument, iStart2, p3, iAmp, iFreq2,iTable 
endin


instr Beep
	iAmp = p4
	iFreq = p5
	iTable = p6	
	aEnvelope linen iAmp, 0.1, p3, 0.5
	aSignal poscil aEnvelope, iFreq, iTable
	outs aSignal, aSignal
endin

    `;

        csound.startRealtime();
        csound.compileOrc(csoundOrchestra);

    };

    return exercise;
}


