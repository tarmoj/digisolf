

function askInterval(clef, direction, containerNode, canvasClassName) {  // clef and direction not needed for now
	if (direction===undefined) direction = "up";
	if (clef===undefined) clef = "treble";
	
	var answered = false;
	var intervalIndex = -1, noteIndex = -1, currentNoteIndex = -1;
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
	var possibleBaseNotes = possibleNotes.slice(0, possibleNotes.length/2); // take on

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
	var directionTranslation = (direction==="up") ? "üles" : " alla" ;
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Intervallide ehitamine: " + directionTranslation + ", "  + ( (clef==="bass") ? "bassivõti." : "viiulivõti." );
	this.containerNode.getElementsByClassName("description")[0].innerHTML = "Antud on helikõrgus ja intervalli nimetus. Ehita intervall, klõpsates noodijoonestikule.<br>Alteratsioonimärkide lisamiseks vajuta + või - nupule või kasuta vatavaid klahve arvutklaviatuuril."; 
	
	
	
	
	
	
	exercise.generate = function() {
				
		//var lowerNoteMidi = 60 + Math.floor(Math.random()* 12); // for now only 1. octave
		
		noteIndex = Math.floor(Math.random()* possibleBaseNotes.length);  //notes.findIndexesByMidiNote(lowerNoteMidi, possibleNotes);
		intervalIndex = Math.floor(Math.random()* possibleIntervals.length);
		
		
		var question = [noteIndex, intervalIndex];
		
		while (!exercise.isNewQuestion(question)) {
			intervalIndex = Math.floor(Math.random()* possibleIntervals.length);
			question = [noteIndex, intervalIndex];
			console.log("Found this amoung questions already! Taking new.");
		}
		
		if (exercise.testIsRunning()) {
			exercise.questions.push(question); 
		} else {
			exercise.questions[0] = question;
		}
		
		var note1 = possibleBaseNotes[noteIndex];
		var interval = possibleIntervals[intervalIndex];
		console.log("Note1: ", note1.name, " interval ", interval.longName);
		
		var note2 = undefined;
		while (note2 === undefined) {
			note2 = intervals.makeInterval(note1, interval.shortName, "up", possibleNotes); // since sometimes makeInterval return undefined
		}
			
		console.log(" note2: ", note2.name);
		//this.containerNode.getElementsByClassName("question")[0].innerHTML =	'<br>Sisesta noodijoonestikule <b>' +possibleIntervals[intervalIndex].longName + " " + directionTranslation +  '</b>.<br>Kui oled noodi sisetanud noodijoonestikule, vajuta Vasta:' ;
		
		
		exercise.notes = ":w " + intervals.makeChord( [note1, note2]) ; // the note the interval is built from
		//exercise.play();
		//currentNoteIndex = -1; 	
		answered = false; 
	}
	
	
	exercise.renew = function() {
		exercise.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
        exercise.generate();
        exercise.draw();
		exercise.play();
	};
	
	exercise.renew();		
	
	exercise.responseFunction = function() {
		if (currentNoteIndex < 0) {
			alert("Sisesta noot noodijoonestikule!")
			return;
		}
		
		if (answered) {
			alert('Sa oled juba vastanud. Vajuta "Uuenda"');
			return;
		}
		
		exercise.attempts += 1;
		var feedback = "";
		var correct = false;
		
		var currentInterval = intervals.getInterval(possibleNotes[noteIndex], possibleNotes[currentNoteIndex]);
		
		if (possibleIntervals[intervalIndex].shortName === currentInterval.interval.shortName && ( currentInterval.direction === direction || currentInterval.direction === "same") ) { 
			feedback += "<b>Intervall õige! </b>"
			correct = true;
		} else {
			var directionString = "";
			if (currentInterval.direction==="up") directionString = "üles";
			if (currentInterval.direction==="down") directionString = "alla";
			// nothing if same
			feedback += "<b>Vale.</b> Sinu sisestatud intervall  on hoopis: <b>" + currentInterval.interval.longName + "  " + directionString + "</b>"; 
			correct = false;
		}
		
		if (correct) {
			exercise.score += 1;
		}
		
		this.containerNode.getElementsByClassName("attempts")[0].innerHTML = exercise.attempts;
		this.containerNode.getElementsByClassName("score")[0].innerHTML = exercise.score;
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = feedback; 		
		answered = true;
		
		if (exercise.testIsRunning) { // add info to test report
			exercise.testReport +=  exercise.currentQuestion.toString() +  '. Küsitud intervall: ' + possibleIntervals[intervalIndex].longName + '. Sisestatud intervall: ' + currentInterval.interval.longName;
			exercise.testReport += ".<br>Tagasiside: " + feedback + "<br>";	
		}
		
	}
	
	return exercise;

}
