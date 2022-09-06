 
// class for piano keyboard -  draw and read key events, no sound production.
// based on: javascript-svg-piano https://github.com/diversen/js-svg-piano by Dennis Iversen

    
function Piano(container, octaveBegin, octaves, width) {

    this.container =container; // TODO: protection if not given
    var _this = this;
    
    this.octaveBegin = octaveBegin == undefined ? 4 : octaveBegin
    this.octaves = octaves == undefined ? 1 : octaves
    this.width = width == undefined ? 300 : width
    this.container.style.maxWidth = this.width.toString() + "px"
    this.container.style.width = "100%" // allow shhrinking in smaller screens
    var height = 80, octaveWidth = 140;
    
    this.pressedKey = {active:false};
    
    this.createPiano = function () {
        var svg = this.getPianoSVG()
        this.container.innerHTML = svg
        this.currentX = 0
        
        // listeners to the keys
		$('rect', this.container).click(function (e) {
			var key = e.target
			console.log("Key: ",key.dataset.midinote);
			
			if (key!= _this.pressedKey && _this.pressedKey.active) { // release old pressed key
				_this.deactivateKey(_this.pressedKey)
			}
			
			if (key.active) {
				_this.deactivateKey(key)
			} else {
				_this.activateKey(key)
			}
			_this.pressedKey = key;
		})  
        
    }

    this.getPianoSVG = function () {
        var boxX = this.octaves * octaveWidth
        
        var octaveBegin = this.octaveBegin
        var html = ' <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" ' +
					' viewBox="0 0 '  + boxX + " " + height + '" ' + 'id="piano">  ' 
            
		html += '<g>';
        for (i = 1; i <= this.octaves; i++) {  
            html += this.getTones(octaveBegin)
            octaveBegin++ 
        }
        html +=  ' </g> </svg> '
            
        return html;
    }

    this.getVextabNote = function(note, octave) {
        return note.toUpperCase() + "/" + octave;
    }
    
      
    this.getMidiNote = function (pitchClass, octave) { // 0 for C, 1- cis etc
        return (octave+1)*12 + pitchClass; // 
    }

    this.currentX = 0
    this.getCurrentX = function (x) {
        return x + this.currentX
    }
    
    this.keyClicked = function(e) {
		console.log("Clicked key", e.target);
    
    }

    this.getTones = function (octave) {
		var whiteKeys = ["C","D", "E", "F","G", "A", "B"];
		var whiteMidi = [0,2,4,5,7,9,11]; // relative to octave
		var blackKeys = ["C#","D#","F#","G#","A#"];
        var blackMidi = [1,3, 6,8,10];
        var whiteWidth = 20, blackWidth = 16, blackHeight = 50;
        var blackX = [whiteWidth - blackWidth/2,  2*whiteWidth - blackWidth/2,  4* whiteWidth - blackWidth/2, 5* whiteWidth - blackWidth/2, 6* whiteWidth - blackWidth/2 ] ; 
        
        var octaveHTML = "";
        
        for (var i=0; i<7; i++) {
// 			octaveHTML += ` <rect class="white" data-vtnote="${this.getVextabNote(whiteKeys[i], octave)}" data-midinote="${this.getMidiNote(whiteMidi[i], octave)}" width="${whiteWidth}" height="${height}" x="${this.getCurrentX(i*20)}" y="0" style="fill:white; stroke-width:1; stroke:grey" /> `;
			
			octaveHTML += ' <rect class="white" data-vtnote="' + this.getVextabNote(whiteKeys[i], octave) + '"  data-midinote="' + this.getMidiNote(whiteMidi[i], octave) + '" width="'+ whiteWidth + '" height="' + height + '" x="' + this.getCurrentX(i*20) + '" y="0" style="fill:white; stroke-width:1; stroke:grey" /> ';
			
        }
        
        for (var j=0; j<5; j++) {
			octaveHTML += ' <rect class="black" data-vtnote="' + this.getVextabNote(blackKeys[j], octave) + '"  data-midinote="' + this.getMidiNote(blackMidi[j], octave) + '" width="'+ blackWidth + '" height="' + blackHeight + '" x="' + this.getCurrentX(blackX[j]) + '" y="0" style="fill:black; stroke-width:1; stroke:black" /> ';
        
        }
            
        this.currentX+= octaveWidth
        return octaveHTML
    }
    
    this.activateKey = function(key) {
		key.active = true;
		key.style.fill = "lightgrey";
    }
    
    this.deactivateKey = function(key) {
		var colour = key.className.baseVal.split(" ")[0] // get the color from className's first part
		key.style.fill = colour;
		key.active = false;
    }
    
    this.fillKey = function(key, colour) {
		key.style.fill = colour;
    }
    
    
    this.findKeyByVextabNote = function(vtNote) { // the note can be either with or without octave: C/4 or F#
		var keys = document.getElementsByTagName("rect");
		for (var i=0; i<keys.length; i++) {
			if (vtNote.indexOf("/")<0) { // octave number not given
				if (keys[i].dataset.vtnote.split("/")[0] === vtNote) 
					return keys[i];
			} else if (keys[i].dataset.vtnote === vtNote) // exact match with octave
				return keys[i];
		}
		return undefined; // what is good for empty object?
    }
    
    this.findKeyByMidiNote = function(midiNote) { // if the midiNote is given under 12, ignore octave and look for first matching pitchClass
		var keys = document.getElementsByTagName("rect");
		for (var i=0; i<keys.length; i++) {
			if (midiNote < 12 ) {
				if (parseInt(keys[i].dataset.midinote)%12 === midiNote) {//ignore octave, find matching pitch class
					return keys[i];
				}
			} else if (parseInt(keys[i].dataset.midinote) === midiNote) { //ignore octave, find matching pitch class
				console.log(keys[i].dataset.midinote)
				return keys[i];
			}
		}
		return undefined; // what is good for empty object?
		
    }
    
    this.deactivateAllKeys = function() {
		var keys = document.getElementsByTagName("rect");
		for (var i=0; i<keys.length; i++) {
			this.deactivateKey(keys[i]);			
		}
	}
    
}
