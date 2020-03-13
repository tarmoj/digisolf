// plays a perfect interval -  whetrher fourth (4/3), fifth (3/2) or octave (2/1) that may be in tune, low on high
// the possible error is given in cents. If cents = 0, take a random amount of cents;
// type -  harmonic|melodic, deviation -  deviation in cents
function intonation(type = "melodic",  instrument = "beep", cents = 0, containerNode = document.body, canvasClassName = "mainCanvas") {

    const possibleDeviations = [5, 10, 20, 30];
    let deviation = 0;
    let midiNote = 60;
    const possibleIntervalRatios = [4/3, 3/2, 2];
    let intervalRatio =  1.5;


    // set necessary methods in exercise
    const exercise = new MusicExercise(containerNode, canvasClassName, 0); // bigger scale for note input
    //exercise.timeToThink = 30; // more time for doing the test


    // Create or set necessary HTML elements
    containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Häälestus.";
    containerNode.getElementsByClassName("description")[0].innerHTML = '';
    containerNode.getElementsByClassName("question")[0].innerHTML = 'Kas intervall on puhas, kitsas või lai? <br>' +
        '<input value="low" class="answer" name="intonation" type="radio"> Kitsas <input value="inTune" class="answer" name="intonation" type="radio"> Puhas' +
        '<input value="high" class="answer" name="intonation" type="radio"> Lai ';


    containerNode.getElementsByClassName("infoDiv")[0].style.visibility = "hidden"; // audio context is muted until first click; use button in startCoundDiv to activate it.
    containerNode.getElementsByClassName("startCsoundDiv")[0].style.visibility = "visible";

    containerNode.getElementsByClassName("startCsoundButton")[0].onclick = function() {
        exercise.startCsound();
        containerNode.getElementsByClassName("infoDiv")[0].style.visibility = "visible"; // audio context is muted until first click; use button in startCoundDiv to activate it.
        containerNode.getElementsByClassName("startCsoundDiv")[0].style.visibility = "hidden";
    };

    exercise.generate = function() { // set the deviation - negative, 0, or positive
        const deviationAmount =  (cents === 0) ? getRandomElementFromArray(possibleDeviations) : cents; // the number of cents the interval can be wrong

        const random = Math.random()*3;
        if (random < 1) {
            deviation = -deviationAmount;
        } else if (random > 2) {
            deviation = deviationAmount;
        } else {
            deviation = 0;
        }
        intervalRatio = getRandomElementFromArray(possibleIntervalRatios);
        midiNote = getRandomInt(60, 72);
        console.log("midinote, interval, deviation:", midiNote, intervalRatio, deviation )
    };

    exercise.renew = function() {
        exercise.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
        exercise.generate();
        exercise.play();
    };

    exercise.play = function() { // use Csound to play the inetrval
        if (csound !== undefined) { // csound is in global space
            // csound instrument 1 (PlayInterval) parameters from p4 on:
            // amp, midinote, intervalRatio, cents, soundtype (1- sine, 2 - saw, 3- square), isMelodic (1|0)
            let csoundString = 'i 1 0 2 ';
            csoundString += exercise.volume + ' ';
            csoundString += midiNote + ' ';
            csoundString += intervalRatio + ' ';
            csoundString += deviation + ' ';
            csoundString +=  ' 3 '; // soundtype: 1- sine, 2 - saw, 3- square
            csoundString += (type === "melodic") ? ' 1 ' : ' 0 ';
            console.log(csoundString);
            csound.inputMessage(csoundString);
        }

    };

    exercise.responseFunction = function() {
        let answer = getRadioValue("answer", containerNode);
        if (answer === undefined) {
            alert("Valige: madal, hääles või kõrge");
            return;
        }

        exercise.attempts += 1;

        let feedback = "";

        if ( (deviation<0  && answer === "low") ||
            (deviation==0  && answer === "inTune") ||
            (deviation>0  && answer === "high") ) {
            feedback += "<b>Õige! </b>" ;
            exercise.score += 1;
        } else {
            feedback += "<b>Vale.</b> "
        }

        if (deviation == 0) {
            feedback += "Intervall on puhas." ;
        } else if (deviation<0) {
            feedback += "Ülemine noot on madal " + Math.abs(deviation) + " senti.";
        } else if (deviation>0) {
            feedback += "Ülemine noot on kõrge " + deviation + " senti.";
        }

        containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
        containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
        containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback;

        if (exercise.testIsRunning) { // add info to test report
            exercise.testReport +=  exercise.currentQuestion.toString() +  '. Vastatud: ' + answer;
            exercise.testReport += ".<br>Tagasiside: " + feedback + "<br>";
        }


    };

    // initialize csound
    // <script src="https://github.com/hlolli/csound-wasm/releases/download/6.12.0-5/csound-wasm-browser.js">  or ext/csound-was-browser must be loaded

    exercise.startCsound = function() {

        const csoundOrchestra = `
giSine ftgen 1,0, 16384, 10, 1 ; Sine
giSawtooth ftgen 2,0,  16384, 10, 1, 0.5, 0.3, 0.25, 0.2, 0.167, 0.14, 0.125, .111   ; Sawtooth
giSquare ftgen 3,  0, 16384, 10, 1, 0,   0.3, 0,    0.2, 0,     0.14, 0,     .111   ; Square

; parameters from p4 -  amp, midinote, intervalRatio, cents, soundtype (1- sine, 2 - saw, 3- square), isMelodic (1|0)
instr PlayInterval
	iAmp = (p4==0) ? 0.3 : p4
	iFreq1 = cpsmidinn(p5) ; pich given as midi note
	iIntervalRatio = p6 ; frequency ratio from base note 1.5 - perfect fifth etc
	iCents = p7 ; deviation in cents, positive or negative 
	iFreq2 = iFreq1 * iIntervalRatio * cent(iCents)
	iSoundType = p8
	iPlayMelodic = p9
	iTable = (iSoundType >0 && iSoundType <=3) ? iSoundType : 1 
	 
	
	iDuration = (iPlayMelodic>0) ? p3/2 : p3
	iStart2 = (iPlayMelodic>0) ? iDuration : 0
	; think how to use samples of instruments
	iInstrument = nstrnum("Beep")
	
	schedule iInstrument, 0, iDuration, iAmp, iFreq1, iTable
	schedule iInstrument, iStart2, iDuration, iAmp, iFreq2,iTable 
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

        csound.setOption("-m 0"); // less console output
        csound.startRealtime();
        csound.compileOrc(csoundOrchestra);
        exercise.renew();
    };

    return exercise;
}


