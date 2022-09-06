

function askIntervalInitial(clef, direction, containerNode, canvasClassName) {  // clef and direction not needed for now
	if (direction===undefined) direction = "up";
	if (clef===undefined) clef = "treble";


	var answered = false;;
	var intervalData = undefined;
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

	var possibleNotes = (clef==="bass") ? notes.bassClefNotes : notes.violinClefNotes;
	//var possibleBaseNotes = possibleNotes.slice(0, possibleNotes.length/2); // take from first octave


	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Intervallide määramine";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "";
	this.containerNode.getElementsByClassName("question")[0].innerHTML =
		'Mis intervall kõlab? (kujul p5, s3, >4 jne) <input class="answer" type="text" size=8> </input> ';

	exercise.generate = function() {

		intervalData =  intervals.getRandomInterval(possibleNotes, "up"); // comes in as: { note1: <object>, note2: <object> , interval: <object>, direction: "up|down" }

		var question = [intervalData]; // for test to chech there isn no repeating questions

		while (!exercise.isNewQuestion(question) ) {
			intervalData =  intervals.getRandomInterval(possibleNotes, "up");
			question = [intervalData];
			console.log("Try again to find new question");
		}

		if (exercise.testIsRunning()) {
			exercise.questions.push(question);
		} else {
			exercise.questions[0] = question;
		}

		console.log("notes, interval ", intervalData.note1.vtNote, intervalData.note2.vtNote, intervalData.interval.shortName );

		exercise.notes = ":w " + intervalData.note1.vtNote;

		answered = false;
	};


	exercise.renew = function() {
		exercise.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
		exercise.generate();
		exercise.draw();
		exercise.play(); // does not work on first time, maybe "Touch on start needed for audio context to start
	};

	exercise.renew();

	exercise.play = function() { // must be (re)defined after renew is called, ie staves created
		console.log("New play");
		if (intervalData !== undefined) {
			exercise.playNote( intervalData.note1.midiNote, 0, 4 );
			exercise.playNote( intervalData.note2.midiNote, 0, 4 );
			console.log("Play interval: ", intervalData.note1.midiNote, intervalData.note2.midiNote);
		}
	};

	exercise.responseFunction = function() {

		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}

		exercise.attempts += 1;
		var feedback = "";
		var correct = false;

		var answer = this.containerNode.getElementsByClassName("answer")[0].value.trim() ;


		if (intervalData.interval.shortName === answer ) {  // NB! this is not fool proof!!! test!
			feedback += "<b>Intervall õige! </b>"
			correct = true;
		} else {
			feedback += "<b>Vale.</b> Mängitud intervall on: <b>" + intervalData.interval.longName + "  (" + intervalData.interval.shortName + ")</b>";
			correct = false;
		}

		if (correct) {
			exercise.score += 1;
		}

		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback;
		exercise.notes = ":w " + intervals.makeChord( [intervalData.note1, intervalData.note2]) ; // the notes the interval is built from
		exercise.draw();
		answered = true;

		if (exercise.testIsRunning) { // add info to test report
			exercise.testReport +=  exercise.currentQuestion.toString() +  '. Mängitud intervall: ' + intervalData.interval.shortName + '. Sisestatud intervall: ' + answer;
			exercise.testReport += ".<br>Tagasiside: " + feedback + "<br>";
		}

	};

	return exercise;

}
