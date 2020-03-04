

function askIntervalInitial(clef, direction, containerNode, canvasClassName) {  // clef and direction not needed for now
	if (direction===undefined) direction = "up";
	if (clef===undefined) clef = "treble";
	
	var answered = false;
	var interval = undefined , note1 = undefined, note2 = undefined;
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	
	var intervals = new IntervalClass();
	var notes = new NoteClass();

	
	// set necessary methods in exercise
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName, 150,10,10,1.5); // bigger scale for note input
 	exercise.time = "";
 	exercise.key = "";
	exercise.timeToThink = 30; // more time for doing the test
	
	
	var possibleIntervals = intervals.possibleIntervals;
	var possibleNotes = notes.violinClefNotes;
	var possibleBaseNotes = possibleNotes.slice(0, possibleNotes.length/2); // take from first octave
	
	

/*	
	if (clef==="bass" ) { 
		exercise.clef ="bass"
		possibleNotes = notes.bassClefNotes;
		if (direction.toLowerCase()==="up") {
			possibleBaseNotes =  ["F/2", "G/2", "A/2", "B/2", "C/3", "D/3"];
		} else {
			possibleBaseNotes =  ["F/3", "G/3", "A/3", "B/3", "C/4"];
		}
	} else {
		exercise.clef = "treble"
		possibleNotes = notes.violinClefNotes;
		if (direction.toLowerCase()==="up") {
			possibleBaseNotes =  ["C/4", "D/4", "E/4", "F/4", "G/4", "A/4"]; 
		} else {
			possibleBaseNotes =  ["C/5", "D/5", "E/5", "F/5", "G/5", "A/5"];
		}
	}
*/	
	
	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Intervallide määramine";
	this.containerNode.getElementsByClassName("description")[0].innerHTML = ""; 
	this.containerNode.getElementsByClassName("question")[0].innerHTML = 
	'Mis intervall kõlab? (kujul p5, s3, >4 jne) <input class="answer" type="text" size=8> </input> '; 
		
	exercise.generate = function() {
				
		//var lowerNoteMidi = 60 + Math.floor(Math.random()* 12); // for now only 1. octave
		
		note2 = undefined; 
		var noteIndex = -1; // Math.floor(Math.random()* possibleBaseNotes.length);  //notes.findIndexesByMidiNote(lowerNoteMidi, possibleNotes);
		var intervalIndex = Math.floor(Math.random()* possibleIntervals.length); // take an interval anf find sutiable notes
		interval = possibleIntervals[intervalIndex];
	
		
		var question = [intervalIndex]; // for test to chech there isn no repeating questions
		
		while (!exercise.isNewQuestion(question) || note2 === undefined ) {
			noteIndex = Math.floor(Math.random()* possibleBaseNotes.length);
			note1 = possibleBaseNotes[noteIndex];
			note2 = intervals.makeInterval(note1, interval.shortName, "up", possibleNotes); // returns undefined if fails, then loop once again
			question = [intervalIndex];
			console.log("Try again to find a valid question");
		}
		
		if (exercise.testIsRunning()) {
			exercise.questions.push(question); 
		} else {
			exercise.questions[0] = question;
		}
		
		console.log("Note1: ", note1.name, " interval ", interval.longName);			
		console.log(" note2: ", note2.name);
		
		exercise.notes = ":w " + note1.vtNote;
		
		//exercise.play();
		answered = false; 
	}
	
	
	exercise.renew = function() {
		exercise.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
        exercise.generate();
		exercise.draw();
		exercise.play(); // does not work on first time, maybe "Touch on start needed for audio context to start
	};
	
	exercise.renew();		
	
	exercise.play = function() { // must be (re)defined after renew is called, ie staves created
		console.log("New play");
		exercise.playNote( note1.midiNote, 0, 4 );
		exercise.playNote( note2.midiNote, 0, 4 );
		console.log("Play interval: ", note1.midiNote, note2.midiNote);
	}
	
	exercise.responseFunction = function() {
		
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		
		exercise.attempts += 1;
		var feedback = "";
		var correct = false;
		
		var answer = this.containerNode.getElementsByClassName("answer")[0].value.trim() ;
		
		
		if (interval.shortName === answer ) {  // NB! this is not fool proof!!! test!
			feedback += "<b>Intervall õige! </b>"
			correct = true;
		} else {
			feedback += "<b>Vale.</b> Mängitud intervall on: <b>" + interval.longName + "  (" + interval.shortName + ")</b>"; 
			correct = false;
		}
		
		if (correct) {
			exercise.score += 1;
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 
		exercise.notes = ":w " + intervals.makeChord( [note1, note2]) ; // the notes the interval is built from	
		exercise.draw();
		answered = true;
		
		if (exercise.testIsRunning) { // add info to test report
			exercise.testReport +=  exercise.currentQuestion.toString() +  '. Mängitud intervall: ' + interval.shortName + '. Sisestatud intervall: ' + answer;
			exercise.testReport += ".<br>Tagasiside: " + feedback + "<br>";	
		}
		
	}
	
	return exercise;

}
