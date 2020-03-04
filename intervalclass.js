
function IntervalClass() {
	
	// TODO: how to handle translation to English and Russian?
	
	this.possibleIntervals = [
		{ shortName: "p1", longName: "puhas priim", semitones: 0, degrees: 0 }, // degrees (astmeid) -  difference in scale degrees (Ces/C/Cis - 0,  Des/D/Dis - 1 etc)
		{ shortName: "v2", longName: "väikes sekund", semitones: 1, degrees: 1 },
		{ shortName: "s2", longName: "suur sekund", semitones: 2, degrees: 1 },
		{ shortName: "v3", longName: "väike terts", semitones: 3, degrees: 2 },
		{ shortName: "s3", longName: "suur terts", semitones: 4, degrees: 2 },
		{ shortName: "p4", longName: "puhas kvart", semitones: 5, degrees: 3 },
		{ shortName: ">4", longName: "suurendatud kvart", semitones: 6, degrees: 3 }, // vähendatud kvint?
		{ shortName: "<5", longName: "vähendatud kvint", semitones: 6, degrees: 4 },
		{ shortName: "p5", longName: "puhas kvint", semitones: 7, degrees: 4 },
		{ shortName: "v6", longName: "väike sekst", semitones: 8, degrees: 5 },
		{ shortName: "s6", longName: "suur sekst", semitones: 9, degrees: 5 },
		{ shortName: "v7", longName: "väike septim", semitones: 10, degrees: 6 },
		{ shortName: "s7", longName: "suur septim", semitones: 11, degrees: 6 },	
		{ shortName: "p8", longName: "puhas oktav", semitones: 12, degrees:  7 },
		
	];
	
	this.possibleChords = [
		{ shortName: "M", longName: "mažoorne kolmkõla", intervalsUp: ["s3", "p5"], intervalsDown: ["v3", "p5"]  }, // intervals from lower note
		{ shortName: "m", longName: "minoorne kolmkõla", intervalsUp: ["v3", "p5"], intervalsDown: ["s3", "p5"]  },
		{ shortName: "M7", longName: "väike mažoorseptakord", intervalsUp: ["s3", "p5", "v7"], intervalsDown: ["v3", "<5", "v7" ]  },
		{ shortName: "<kk", longName: "vähendatud kolmkõla", intervalsUp: ["v3", "<5"], intervalsDown: ["v3", "<5"]  }
		
	];
	
	this.noInterval = {shortName: "none", longName: "määratlemata", semitones: -1, degrees: -1}; // to be used if nothing found
	
	this.findIntervalBySemitones = function(semitones, degrees) {
		//  degrees -  numbers of scale degrees between the notes
		if (semitones>12) {
			alert("Liiga suur intervall, oktavit ignoreeritakse");
			semitones = semitones % 12;
			degreees = degrees - 7;
		}
		var intervals = [];
		
		for (var i= 0; i<this.possibleIntervals.length; i++) { 
			if (semitones === this.possibleIntervals[i].semitones) {
				intervals.push(this.possibleIntervals[i]); // several intervals can be with same semitones  distance
			}
		}
		
		if (intervals.length === 0) {
			return this.noInterval;
		}
		
		if (degrees === undefined) {
			return intervals[0]; // first found interval if degrees is not set
		} else {
			for (var j=0; j<intervals.length; j++ ) {
				if (intervals[j].degrees === degrees) {
					return intervals[j];
				}
			}
		}
		return this.noInterval;
	};
	
	this.findIntervalByShortName = function(shortName) {
		for (var i= 0; i<this.possibleIntervals.length; i++) {
			if (shortName === this.possibleIntervals[i].shortName) {
				return this.possibleIntervals[i];
			}
		}
		return this.noInterval;
	};
	
	this.findIntervalByLongName = function(longName) {
		for (var i= 0; i<this.possibleIntervals.length; i++) {
			if (longName === this.possibleIntervals[i].longName) {
				return this.possibleIntervals[i];
			}
		}
		return this.noInterval;
	};
	
	this.getInterval = function(note1, note2) { // return interval object and direction
		if (note1 === undefined || note2 === undefined) {
			console.log("Notes undefined");
			return {interval: this.noInterval, direction: "none"};
		}
		var semitones = note2.midiNote - note1.midiNote;
		var direction; 
		if (semitones>0) 
			direction = "up";
		else if (semitones==0) 
			direction = "same";
		else
			direction = "down";
		// we need also info about octaves
		var oct1 =  parseInt(note1.vtNote.split("/")[1]); // take octave from vtNote like C/5, B#/4 
		var oct2 = parseInt(note2.vtNote.split("/")[1]);
		//console.log("oct1, oct2", oct1, oct2,  note2.degree+oct1*7,note1.degree+oct2*7 )
		var degrees = Math.abs((note2.degree+oct2*7) - (note1.degree+oct1*7)); // put the degrees int onw scale, so the difference gives the distance of degrees

		var interval = this.findIntervalBySemitones(Math.abs(semitones), degrees);
		//console.log("semitones, degrees, interval, direction", semitones, degrees, interval.longName, direction )
		return {interval: interval, direction: direction};
	};
	
	this.makeInterval = function(note, shortName, direction, possibleNotes) { // possibleNotes -  array of note objects
		// return found note as object or undefined otherwise
		
		var midiNote1 = note.midiNote;
		var interval = this.findIntervalByShortName(shortName);
		var semitones = interval.semitones;
		var degrees = interval.degrees;
		if (interval.semitones === -1) { // not found
			console.log(shortName," not found");
			return;
		}
		if (direction==="down") {
			semitones = -semitones;
			degrees = -degrees;
		}
		
		var oct1 = parseInt(note.vtNote.split("/")[1]); // 4 for first octava etc
		var degree1 = note.degree + oct1*7 ; // take also octave into account to get correct difference
		//console.log("note: ", note.midiNote, oct1, degree1);


		// find note by midiNote
		for (var i=0; i<possibleNotes.length; i++) {
			var oct2 = parseInt(possibleNotes[i].vtNote.split("/")[1]);
			var degree2 = possibleNotes[i].degree + oct2*7;
			if ( (possibleNotes[i].midiNote === note.midiNote + semitones) &&  (degree2 === (degree1 + degrees)) ) {
				console.log("Found: ", i, possibleNotes[i].vtNote);
				return possibleNotes[i];
			}
		}
		
		return undefined;// otherwise return undefined
	};

	this.getRandomInterval = function(possibleNotes, direction) {
		if (direction === undefined) {
			direction = Math.random() > 0.5 ? "up" : "down"; // 50/50 probability
		}
		var note1 = possibleNotes[Math.floor(Math.random()* possibleNotes.length)];
		var note2 = undefined;
		var maxIntervalInSemitones = 12 ; // constant for now, make a parameter later
		var interval;
		var safeCounter = 0;

		while ( note2 === undefined) { // make sure that the other note is not the same, i.e exclude unisono (primo) AND interval is not bigger than allowed
			//note2 = possibleNotes[Math.floor(Math.random()* possibleNotes.length)];
			var semitones  = Math.floor(Math.random()*maxIntervalInSemitones);
			interval = this.findIntervalBySemitones(semitones);
			note2 = this.makeInterval(note1, interval.shortName, direction, possibleNotes); // undefined if the interval does not work out
			// NB! if note1 is lowest note and direction is down or vices versa -  may create endless loop!
			if (++safeCounter>10) {
				console.log("Let's try with different note1");
				note1 = possibleNotes[Math.floor(Math.random()* possibleNotes.length)];
			}
		}

		// // if direction is set, make sure that note 1 is higher/lower than the other one; swap, if necessary
		// if ( (direction === "up" && note2.midiNote < note1.midiNote ) ||
		// 	(direction === "down" && note2.midiNote > note1.midiNote ) ) {
		// 		var temp = note2;
		// 		note2 = note1;
		// 		note1 = temp;
		// }


		console.log("Notes: ", note1.vtNote, note2.vtNote);

		return { note1: note1, note2: note2, interval: interval, direction: direction };  // direction - makes sense if it was not set and taken randomly
	};
	
	
	this.makeChord = function(noteArray) { // noteArray - array of type possibleNotes, to have midiNotes to sort those
		// sort, return vtString (<note>.<note>.<et>)
		if (noteArray.length<2) {
			console.log("Not enough notes for chord");
			return "";
		}
		var localArray = noteArray.slice(); // otherwise original array will be sorted
		localArray.sort(function(a,b) { return a.midiNote - b.midiNote; }  )
		var vtString = "("; // make vextab chord notation
		for (var i=0; i<localArray.length; i++) {
			
			if (i>0 && localArray[i] !== undefined) vtString += "."; // separator between chord notes
			if (localArray[i] !== undefined)
				vtString += localArray[i].vtNote;
		}
		vtString += ")";
		//console.log("Sorted chord: ", vtString);
		return vtString;
		
	};
	
}
