function askIntervalTonicChord(clef = "treble", direction = "up", containerNode = document.body, canvasClassName = "mainCanvas") {  // clef and direction not needed for now
    const notes = new NoteClass();
    const possibleNotes = clef === "bass" ? notes.bassClefNotes : notes.violinClefNotes;
    const octaveNotes = possibleNotes.slice(0, 21);	// First octave
    const tonicNote = getRandomElementFromArray(octaveNotes);	// Select random note from octave as tonic note
    const tonicNotes = getAllNotesWithSameName(tonicNote, possibleNotes);	// Get all tonic notes
    const isMajor = getRandomBoolean();
    const selectedTonicNote = getRandomElementFromArray(tonicNotes);	// Select random note from tonic notes

    // set necessary methods in exercise
    const exercise = new MusicExercise(containerNode, canvasClassName, 150,10,10,1.5); // bigger scale for note input
    exercise.time = "";
    exercise.key = "";
    exercise.timeToThink = 30; // more time for doing the test
    exercise.clef = clef;

    // Create or set necessary HTML elements
    containerNode.getElementsByClassName("exerciseTitle")[0].innerHTML = "Intervalli määramine toonika kolmkõla helide vahel";
    containerNode.getElementsByClassName("description")[0].innerHTML = "";

    containerNode.getElementsByClassName("replyButton")[0].style.visibility = "hidden";
    containerNode.getElementsByClassName("question")[0].style.visibility = "hidden";

    let intervalData = getNewInterval(isMajor, selectedTonicNote, possibleNotes);

    exercise.renew = function() {
        exercise.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
        intervalData = getNewInterval(isMajor, selectedTonicNote, possibleNotes);
        exercise.play();
    };

    exercise.play = function() {
        containerNode.getElementsByClassName("replyButton")[0].style.visibility = "visible";
        containerNode.getElementsByClassName("question")[0].style.visibility = "visible";
        containerNode.getElementsByClassName("question")[0].innerHTML =
            'Mis intervall kõlab? (kujul p5, s3, >4 jne) <input id="answerInput" type="text" size=8> </input> ';
        document.getElementById("answerInput").focus();

        exercise.playNote(intervalData.note1.midiNote, 0, 4);
        exercise.playNote(intervalData.note2.midiNote, 0, 4);
        console.log("Play interval: ", intervalData.note1.midiNote, intervalData.note2.midiNote);
    };

    exercise.responseFunction = function() {
        exercise.attempts += 1;
        let answer = containerNode.getElementsByClassName("answer")[0].value.trim();

        let feedback = "";
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
    };

    return exercise;
}

function getNewInterval(isMajor, selectedTonicNote, possibleNotes) {
    const triadNote = getTriadNote(isMajor, selectedTonicNote, possibleNotes);
    return getInterval(selectedTonicNote, triadNote);
}