
// Base class for Music Exercises
// uses VexTab / VexFlow for notation 
// WebAudiofontPlayer for audio playback

// the host webpage must load:
// <script src="https://unpkg.com/vextab/releases/vextab-div.js"></script>
// <script src='https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js'></script>
// <script src='https://surikov.github.io/webaudiofontdata/sound/0000_JCLive_sf2_file.js'></script> 
//

function MusicExercise(containerNode, canvasClassName, width, x, y, scale, noSound ) {
	this.containerNode = containerNode===undefined ? document.body : containerNode; // to  make it independent and enable to use several exercises per page

	if (canvasClassName === undefined) { // if not given, create div for canvas
		this.canvas = document.createElement("div");
		this.canvas.className = "mainCanvas";
		this.containerNode.appendChild(this.canvas);
	} else {
		this.canvas = this.containerNode.getElementsByClassName(canvasClassName)[0]; // but always try to give the element, to have it in certain place!
	}
	
	if (noSound !== undefined) {
		this.noSound = (noSound.toString().toLowerCase() === "nosound" || noSound===true); // set to true, if the exercise does not need sound
	} else {
		this.noSound = false;
	}
	
	var _this = this;
	
	// Notation elements
	this.canvasWidth = width === undefined ? 600 : width; // NB! if set to 0, don't create notation
	this.canvasX = x === undefined ? 10 : x;
	this.canvasY = y === undefined ? 10 : y;
	this.canvasScale = scale === undefined ? 0.8 : scale;
	
	this.notes = ""; // notenames, durations  and octaves in vextab format like ":4 C/4" -  and other parts of VT notation
	this.numberOfVoices = 1;
	this.currentVoice = 0; // index of voice/stave
	
	
	this.key = "C";
	this.time = "4/4";
	this.clef = "treble";
		
    this.vtEndString = "\noptions space=20\n";
	
	//results and feedback
	this.attempts = 0;
	this.score = 0;
	this.questions = []; // array to contain last asked question if normal mode or all questions of a test, if test mode
    
    // for tests -------------
    this.timer = -1;
	this.timeToThink = 15; // Could be also il levels:  slow/medium/fast
	this.maxQuestions = 5;
	this.totalTestTime = 0; 
	this.currentQuestion = 0; // should be local variables defined with var but this is not reachable from countdown() if it is executed from setTimeout callbaclk. javascript.....
	this.countdownReference = NaN;
	this.saveToPdf = false;
	this.testReport = ""; // string containing info about all responses in test. in HTML format;
	
	
	// main methods -----------------
	this.createVexTabString = function() {
		var startString = "options space=20\n stave \n "; // was tabstave before but this is not needed
		var clefString = (this.clef.length>0) ? "clef="+this.clef+"\n" : "";
		var keyString = (this.key.length>0) ? "key="+this.key+"\n" : "";
		var timeString = (this.time.length>0) ?  "time="+this.time+"\n" : "";
		var notesString = (this.notes==="") ? ""  : "\nnotes " + this.notes + "\n";
		var endString = "\noptions space=20\n";
		return startString + clefString + keyString + timeString + notesString + endString;
	}
	
	
	this.clickActions = function(x,y){ console.log("clickactions", x,y)}; // you can define other things to be done connected to click event
	
	this.handleClick = function(event) {
		var _x = event.layerX / _this.canvasScale; // This is not consistent. Requires handling in exercises (drawx= x-canvas.X). Think
		var _y =  (event.layerY - _this.canvas.offsetTop) / _this.canvasScale; // was: clientX, clientY 
		//console.log("Click coordinates: ",_x,_y, event);
		_this.clickActions(_x,_y); // this workaround is necessary to be able to overload clickActions to reach "this." properties
	}

	this.init = function() {
			// for SVG -  remove everything what is inside the div:
			while (this.canvas.firstChild) {
				this.canvas.removeChild(this.canvas.firstChild);
			}
			// Feedback and results, hide test div
			this.containerNode.getElementsByClassName("attempts")[0].innerHTML = "0";
			this.containerNode.getElementsByClassName("score")[0].innerHTML = "0";
			this.containerNode.getElementsByClassName("testDiv")[0].style.visibility="hidden";
			this.containerNode.getElementsByClassName("responseDiv")[0].innerHTML = ""; 
			
			// VexTab
			if (this.canvasWidth>0) {
				var vt = VexTabDiv;
				var VexTab = vt.VexTab;
				var Artist = vt.Artist;
				var Renderer = Vex.Flow.Renderer;
				this.renderer = new Renderer(this.canvas, Renderer.Backends.SVG); 
				this.artist = new Artist(this.canvasX, this.canvasY , this.canvasWidth, {scale: this.canvasScale}); 
				this.vextab = new VexTab(this.artist);

				//Audio renderer
				if (!this.noSound) {
					this.selectedPreset=_tone_0000_JCLive_sf2_file;
					var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
					this.audioContext = new AudioContextFunc();
					this.player=new WebAudioFontPlayer();
					this.player.loader.decodeAfterLoading(this.audioContext, '_tone_0000_JCLive_sf2_file');
				}					
				// add event listener for canvas clicks (SVG)
				this.renderer.getContext().svg.addEventListener('click',this.handleClick, false);
			} else {
				this.noSound = true;
				console.log("Canvas width is 0, renderer and player not created.");
			}

	}
	
	this.init();
	
	this.isNewQuestion = function(question) {
		var isNew = true;
		for (var i=0; i<this.questions.length; i++ ) {
			if (this.questions[i]===question) {
				isNew = false;
			}
		}
		return isNew;
	}
	
	this.generate = function() {console.log("generate(). Implement in derived object.");}
	
	this.draw = function (string) { // if string is given (full vectab notation string), use that to generate notation from
		try {
			this.vextab.reset();
			this.artist.reset();
			var parseString = (string===undefined) ? this.createVexTabString() : string; // allow to set the string by user;
			this.vextab.parse(parseString);
			this.artist.render(this.renderer);
		} catch (e) {
			console.log(e);
		}
	}
	
	this.renew = function() { // in some exercise you may need to add more functionality, like hide() or similar
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
        this.generate();
        this.draw();
    }
	
	
	this.getNotes = function(staff) {
		if (typeof(staff)=="undefined") {
			staff=0			
		}
		return this.artist.staves[staff].note_notes;		
	}
		
	this.responseFunction = function()  {console.log("Implement in derived object;")}
	
	this.checkResponse = function() {
		this.responseFunction();
		if (this.testIsRunning() ) {
			this.nextQuestion(); // this also stops the countdown of test question
		}
	}

	
	// methods for making tests ----------------
	
	// TODO: add timeSpent + feedback "Testi tegemiseks kulus aega: "+ this.timeSpent
	
	var startTime = 0;
	
	function countdown() {		
        //console.log(_this.timer);
        this.containerNode.getElementsByClassName("timer")[0].innerHTML = _this.timer.toString();
		this.totalTestTime = (Date.now() - startTime) / 1000.0;
		this.containerNode.getElementsByClassName("totalTestTime")[0].innerHTML = this.totalTestTime.toString();
		if (_this.timer>0) { 
            _this.timer--;
            _this.countdownReference = setTimeout(function(){countdown();}, 1000); // recursive
            return;
		}
		
		if (_this.timer==0) {						
			if (_this.currentQuestion<_this.maxQuestions) {
                _this.checkResponse(); // checkResponse calls nextQuestion(), renew() and resets the timer 
			} else {
                console.log("Test ended");
				clearTimeout(_this.countdownReference);
				_this.stopTest();
			}
		}		
	}
	
	
	
	this.startTest = function() {	
        this.attempts=0; this.score=0;
        this.testReport = "";
        this.questions = [];
        this.containerNode.getElementsByClassName("attempts")[0].innerHTML="0"; 
        this.containerNode.getElementsByClassName("score")[0].innerHTML = "0";
        this.containerNode.getElementsByClassName("totalTestTime")[0].innerHTML = "0";
        this.containerNode.getElementsByClassName("feedback")[0].innerHTML = "";
        if (this.saveToPdf) {
			if (!Boolean(document.getElementsByClassName("name")[0].value)) { // do not let to start if name is not entered but wants to store the result
				alert("Testi salvestamiseks peab sisestama nime.");
				return;
			}
		}
        this.timer = this.timeToThink;
		startTime = Date.now();
		this.currentQuestion = 0;
		this.nextQuestion();		
	}
	
	this.testIsRunning = function() {
        return (this.timer>=0)
    }
    
    this.nextQuestion = function() {
		clearTimeout(_this.countdownReference); // stop timer
		if (this.currentQuestion<this.maxQuestions) {
			this.currentQuestion++; 
			this.containerNode.getElementsByClassName("questionNumber")[0].innerHTML = this.currentQuestion.toString();
			this.renew();
			this.timer = this.timeToThink;
			countdown();
		} else {
			console.log("Test finished");
			this.stopTest();
		}
		
	}
    
    this.makePDF = function() {
		// very initial state, just for testing
		var doc = new jsPDF();
		var title, date, name, result;
		title = this.containerNode.getElementsByClassName("exerciseTitle")[0].innerText;
		date = new Date();
		name = document.getElementsByClassName("name")[0].value; // check that name may not be empty!
		result = this.attempts + " katsest " + this.score + " õiget."
		var content = document.createElement("div");
		
		content.innerHTML = '<h1>Muusikaharjutuste testi tulemus</h1>' +
			'<br><b>Nimi:</b> ' +  name  + 
			'<br><b>Harjutus:</b> ' + title +  
			'<br><b>Soortitatud:</b> ' + date.toLocaleString() + 
			'<br><b>Tulemus:</b> ' + result + 
			'<br><b>Aega kulus:</b> ' + this.totalTestTime.toString() + ' sekundit.' + 
			'<br>Vastused:<br>' + this.testReport;
			
		console.log("Testtime ", this.totalTestTime, this.totalTestTime.toString);
		doc.fromHTML(content, 20, 30);
		// construct filename
		var fileName = name + "_" + title + ".pdf";
		fileName = fileName.replace(/\s+/g, '_').toLowerCase(); // replace spaces and to lowercase
		doc.save(fileName);
	}
    
    this.stopTest= function() {
        console.log("Stop");
        clearTimeout(_this.countdownReference);
		this.timer = -1;
		this.totalTestTime =  (Date.now() - startTime)/1000.0 ; // check the end time;
		this.containerNode.getElementsByClassName("totalTestTime")[0].innerHTML = this.totalTestTime.toString();
		this.containerNode.getElementsByClassName("feedback")[0].innerHTML = "Vastused:<br>" + this.testReport;
		startTime = 0; 
		if (this.saveToPdf) {
				this.makePDF();
		}
        this.currentQuestion = 0;
		this.containerNode.getElementsByClassName("questionNumber")[0].innerHTML = "0";
		this.containerNode.getElementsByClassName("timer")[0].innerHTML = "0";
		this.questions = [];
    }
	
	
	//audio -------------------------------------
	this.volume = 0.3;
	this.tempo = 60.0;
	this.playNote = function(midiNote, start, duration, volume) {
		if (volume === undefined) {
			volume = this.volume;
		}
		this.player.queueWaveTable(this.audioContext, this.audioContext.destination,
		this.selectedPreset, this.audioContext.currentTime+start, midiNote, duration, volume);
	}

	this.play = function() {
		if (this.noSound) {
			console.log("No sound enabled");
			return;
		}
		var _start = 0, _duration = 1;
		var notes = this.artist.staves[0].note_notes ;
		//console.log("notes: ", notes)
		for (var i=0; i<notes.length; i++ ) {
			var _note = notes[i];
			//console.log("Note to play:", _note);
			if (_note.duration!=="b") { // check if not barline
				_duration = _note.getTicks().value()/4096.0 * 60.0/this.tempo;
				var keys = _note.getPlayNote(); // can be an array if chord
				for (var j=0; j<keys.length; j++) { 
					var noteName = keys[j].split("/")[0];
					var octave = parseInt( keys[j].split("/")[1]);
					noteName = noteName.trim().toLowerCase();
					if (noteName === "b#" || noteName === "b##") { // his means -  midi pitch in actually of next octave
						octave += 1;
					}
					if (noteName === "cb" ||  noteName === "cbb") { // his means -  actually h/b of lower octave
						octave -= 1;
					}
					var noteValue =Vex.Flow.Music.noteValues[noteName];
					var midiNote = (24 + ((octave-1) * 12)) + noteValue.int_val;
					// TODO: octave is wrong if
					// get start from note, maybe 
					//console.log(midiNote, _start, _duration); // 
					if (_note.noteType=="n") { 
						this.playNote(midiNote, _start, _duration);
					}
				}
				_start += _duration;  
			} 
		}
	}
}

 

