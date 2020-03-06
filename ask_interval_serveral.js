
// näidisharjutus Andreselt, takt 72: "Intervall antud noodist, rütmiseeritud, mitu järjest
// hetkel 2 intervalli järjest, võibolla tulevikus luba seadistada 2, 3, 4 vms

function askIntervalSeveral(type, clef, containerNode, canvasClassName) {  // clef and direction not needed for now
	// type : "harmonic | melodic | rhythmized"

	if (type===undefined) type = "harmonic";
	if (clef===undefined) clef = "treble";


	var answered = false;
	var intervalData1 = undefined, intervalData2 = undefined;
	this.containerNode = containerNode===undefined ? document.body : containerNode;
	this.canvasClassName = canvasClassName === undefined ? "mainCanvas" : canvasClassName;
	
	var intervals = new IntervalClass();
	var notes = new NoteClass();

	
	// set necessary methods in exercise
	var width = (type === "harmonic") ? 150 : 300 ; // wider canvas for melodic and rhytmized
	var exercise = new MusicExercise(this.containerNode, this.canvasClassName, width,10,10,1.5); // bigger scale for note input
 	exercise.time = "";
 	exercise.key = "";
	exercise.timeToThink = 30; // more time for doing the test
	exercise.clef = clef;
	exercise.tempo =  (type=== "harmonic") ? 100 : 60;
	
	var possibleNotes = notes.violinClefNotes;


	// Create or set necessary HTML elements
	this.containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Intervallide määramine";
	var description, question;
	switch (type) {
		case "harmonic" : description = 'Kõlavad kaks harmoonilist intervalli.'; break;
		case "rhythmized" : description = 'Kõlavad kaks pausidega eraldatud motiivi, mõlemal on oma intervall'; break;
		case "melodic" : description = 'Kõlavad kaks meloodilist, pausidega eraldatud intervalli.'; break; break;
		default: description = ""; break;
	}

	description += '<br>Alustamiseks vajutage "Mängi"';
	this.containerNode.getElementsByClassName("description")[0].innerHTML =  description;
	this.containerNode.getElementsByClassName("question")[0].innerHTML = 
	'Mis intervallid  kõlavad? Eraldage tühikuga (nt p5  >4) <input class="answer" type="text" size=8> </input> ';

	// rhythm  patterns of one beat 16 -  16th, 8 - 8th etc 8d -  8th with dot; negative: rest
	// evey pattern must have at least 2 notes
	var possiblePatterns = [
		"8 8",  "8d 16", "16 8d",
		"8 16 16", "16 8 16",  "16 16 8",
		"-8 16 16", "-16 8 16",  "-16 16 8",
		"8 -16 16", "16 -8 16",  "16 -16 8",
		"8 16 -16", "16 8 -16",  "16 16 -8",
		"16 16 16 16",  "-16 16 16 16",
		"16 16 -16 16",  "16 16 16 -16",
		"16 -16 16 -16",  "-16 16 -16 16",
		"16 -16 -16 16",  "16 -16 -16 16"
	];

	exercise.getRandomPattern =  function(noteArray, beats) { // combines given notes with a random ryhthm pattern over given number of beats, deafult is 1 beat
		// noteArray - array of notes in vextab notation, must have at least 2 notes and both of them mut be used
		if (noteArray.length<2) {
			console.log("At least 2 notes must be given as array in first parameter.");
			return "";
		}

		if (beats === undefined) {
			beats = 1;
		}

		var localArray = noteArray.slice(); // otherwise original array will be sorted
		localArray.sort(() => Math.random() - 0.5); // simple shuffle to get the notes in random order

		var vextabString = "";
		var pattern = possiblePatterns[Math.floor(Math.random() * possiblePatterns.length )];
		var elements = pattern.split(" ");
		var counter = 0;
		// TODO: make sure that at least 2 notes of the pattern are used
		// maybe: shuffle the possibleNotes array every time it is exhausted?
		for  (var i=0; i<elements.length; i++) {
			var vtElement = "";
			var duration = parseInt(elements[i]);
			duration /= beats;
			if ( duration < 0 ) { // rest
				vtElement = " :" + Math.abs(duration) + " ##"; // vextab rest
			} else {
				vtElement = " :" + duration + " " + localArray[counter];
			}
			console.log(i, counter, vtElement);
			vextabString += vtElement;
			if (++counter >= localArray.length) {
				counter = 0;
				localArray.sort(() => Math.random() - 0.5); // reshuffle
			}
		}
		return vextabString;
	};

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
		} else if (type === "rhythmized") {
			exercise.notes = exercise.getRandomPattern([intervalData1.note1.vtNote, intervalData1.note2.vtNote], 1 );
			exercise.notes += " :4 ## "; // add quarter rest in between
			exercise.notes += exercise.getRandomPattern([intervalData2.note1.vtNote, intervalData2.note2.vtNote], 1 );
			exercise.notes += " :4 ## ";
		} else { // melodic
			exercise.notes = " : 4 " + intervalData1.note1.vtNote + " " + intervalData1.note2.vtNote;
			exercise.notes  += " ## " +  intervalData2.note1.vtNote + " " + intervalData2.note2.vtNote;
		}

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
			exercise.testReport +=  exercise.currentQuestion.toString() +  '. Mängitud intervall 1 : ' + intervalData1.interval.shortName + '. Sisestatud intervall: ' + answer;
			exercise.testReport +=  exercise.currentQuestion.toString() +  '. Mängitud intervall 2 : ' + intervalData2.interval.shortName + '. Sisestatud intervall: ' + answer;
			exercise.testReport += ".<br>Tagasiside: " + feedback + "<br>";	
		}
		
	};
	
	return exercise;

}
