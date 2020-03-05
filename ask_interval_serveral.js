
// näidisharjutus Andreselt, takt 72: "Intervall antud noodist, rütmiseeritud, mitu järjest
// hetkel 2 intervalli järjest, võibolla tulevikus luba seadistada 2, 3, 4 vms

function askIntervalSeveral(type, clef, containerNode, canvasClassName) {  // clef and direction not needed for now
	// type : "harmonic | melodic | rhythmisized"

	if (type===undefined) type = "harmonic";
	if (clef===undefined) clef = "treble";


	var answered = false;
	var intervalData1 = undefined, intervalData2 = undefined;
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	
	var intervals = new IntervalClass();
	var notes = new NoteClass();

	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName, 150,10,10,1.5); // bigger scale for note input
 	exercise.time = "";
 	exercise.key = "";
	exercise.timeToThink = 30; // more time for doing the test
	exercise.clef = clef;
	
	var possibleIntervals = intervals.possibleIntervals;
	var possibleNotes = notes.violinClefNotes;
	var possibleBaseNotes = possibleNotes.slice(0, possibleNotes.length/2); // take from first octave


	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Intervallide määramine";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = 'Kõlavad kaks intervalli. Alustamiseks vajutage "Mängi"';
	this.containerNode.getElementsByClassName("question")[0].innerHTML = 
	'Mis intervallid  kõlavad? Eraldage tühikuga (nt p5  >4) <input class="answer" type="text" size=8> </input> ';
		

	exercise.generate = function() {

		intervalData1 =  intervals.getRandomInterval(possibleNotes); // comes in as: { note1: <object>, note2: <object> , interval: <object>, direction: "up|down" }
		intervalData2 =  intervals.getRandomInterval(possibleNotes);

		var question = [intervalData1, intervalData2]; // for test to check  if there isn no repeating questions

		while (!exercise.isNewQuestion(question) ) {
			intervalData1 =  intervals.getRandomInterval(possibleNotes); // random direction
			intervalData2 =  intervals.getRandomInterval(possibleNotes);
			question = [intervalData1, intervalData2];
			console.log("Try again to find new question");
		}
		
		if (exercise.testIsRunning()) {
			exercise.questions.push(question); 
		} else {
			exercise.questions[0] = question;
		}
		
		console.log("Intervals: ", intervalData1.interval.shortName, intervalData2.interval.shortName );

		// TODO: make rhythm

		// test the notes for now:
		if (type === "harmonic") {
			exercise.notes = ":2 " + intervals.makeChord([intervalData1.note1, intervalData1.note2]);
			exercise.notes += ":2 " + intervals.makeChord([intervalData2.note1, intervalData2.note2]);
		} // TODO: melodic, rhytmisized

		answered = false;
	}
	
	exercise.hide = function(hidden) {
		// later: hide notes, now brutally make canvas invisible
		if (hidden) {
			exercise.canvas.style.display = "none";
		} else {
			exercise.canvas.style.display = "block";
		}
	}

	exercise.renew = function() {
		exercise.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
        exercise.generate();
		exercise.draw();
		exercise.hide(true);
		exercise.play(); // does not work on first time, maybe "Touch on start needed for audio context to start
	};
	
	exercise.renew();		
	
	/*exercise.play = function() { // must be (re)defined after renew is called, ie staves created
		console.log("New play");
		exercise.playNote( note1.midiNote, 0, 4 );
		exercise.playNote( note2.midiNote, 0, 4 );
		console.log("Play interval: ", note1.midiNote, note2.midiNote);
	}*/
	
	exercise.responseFunction = function() {
		
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		
		exercise.attempts += 1;
		var feedback = "";
		var correct = false;
		
		var answer = this.containerNode.getElementsByClassName("answer")[0].value.trim() ;
		var answeredIntervals  = answer.split(" ");


		// TODO: more foolproog checking, use different elements for input
		if (intervalData1.interval.shortName === answeredIntervals[0] ) {  // NB! this is not fool proof!!! test!
			feedback += "<b>Intervall 1  õige! </b><br>"
			correct = true;
		} else {
			feedback += "<b>Vale.</b> Esimene intervall on: <b>" + intervalData1.interval.longName + "  (" + intervalData1.interval.shortName + ")</b><br>";
			correct = false;
		}

		if (intervalData2.interval.shortName === answeredIntervals[1]) {  // NB! this is not fool proof!!! test!
			feedback += "<b>Intervall 2  õige! </b><br>"
			correct = true;
		} else {
			feedback += "<b>Vale.</b> Teine intervall on: <b>" + intervalData2.interval.longName + "  (" + intervalData2.interval.shortName + ")</b><br>";
			correct = false;
		}

		
		if (correct) {
			exercise.score += 1;
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 

		exercise.hide(false); // must be before draw, otherwi
		exercise.draw();

		answered = true;
		
		if (exercise.testIsRunning) { // add info to test report
			exercise.testReport +=  exercise.currentQuestion.toString() +  '. Mängitud intervall: ' + interval.shortName + '. Sisestatud intervall: ' + answer;
			exercise.testReport += ".<br>Tagasiside: " + feedback + "<br>";	
		}
		
	};
	
	return exercise;

}
