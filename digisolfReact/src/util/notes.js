import {defaultNotationInfo} from "../components/notation/notationUtils";


// Think about different conventions: classical german - b,h, classical scandinavian (bes, b), syllabic (do, re mi), syllabic russian
// See lilypond definitions https://lilypond.org/doc/v2.18/Documentation/notation/writing-pitches#note-names-in-other-languages
// define as map where key is (lilypond) noteName, value VexTab note
export const noteNames = new Map([
	["ceses","C@@"], ["ces","C@"], ["c","C"], ["cis","C#"], ["cisis","C##"],
	["deses","D@@"], ["des", "D@"], ["d", "D"], ["dis","D#"], ["disis","D##"],
	["eses","E@@"], ["es","E@"], ["e","E"], ["eis","E#"], ["eisis","E##"],
	["feses","F@@"], ["fes","F@"], ["f","F"], ["fis","F#"], ["fisis","F##"],
	["geses","G@@"], ["ges","G@"], ["g","G"], ["gis","G#"], ["gisis","G##"],
	["ases","A@@"], ["as","A@"], ["a","A"], ["ais","A#"], ["aisis","A##"],
	["heses","B@@"], ["b","B@"], ["h","B"], ["his","B#"], ["hisis","B##"]
]);


// orig:
/*export const noteNames = [
	"ceses", "ces", "c", "cis", "cisis",
	"deses", "des", "d", "dis", "disis",
	"eses", "es", "e", "eis", "eisis",
	"feses", "fes", "f", "fis", "fisis",
	"geses", "ges", "g", "gis", "gisis",
	"ases", "as", "a", "ais", "aisis",
	"heses", "b", "h", "his", "hisis"
];*/

// võibolla vaja ka export const alterations = [{VT:"@@", normal:"eses"}]

// võibolla on mõtetu defineerida kõik -isid ja -esid eraldi, migem ainult noodinimed ning funktsioon
// isNoteName (noteName) => / on, kui esimene täht kuulub nootide hulka, ülejäänud /


export const violinClefNotes = [   // line - line number in staff: 0 upper, 4 - lower, 5 - lower ledger line. Used to draw the note
	{vtNote:"C@/4", name:"ces1", syllable:"do-bemoll1", midiNote: 59, degree: 0 }, // degrees (astmed) -  scale degrees (Ces/C/Cis - 0,  Des/D/Dis - 1 etc)
	{vtNote:"C/4", name:"c1", syllable:"do1", line: 5, midiNote: 60, degree: 0},
	{vtNote:"C#/4", name:"cis1", syllable:"do-diees1", midiNote: 61, degree: 0},

	{vtNote:"D@/4", name:"des1", syllable:"re-bemoll1", midiNote: 61, degree: 1},
	{vtNote:"D/4", name:"d1", syllable:"re1", line: 4.5, midiNote: 62, degree: 1},
	{vtNote:"D#/4", name:"dis1", syllable:"re-diees1", midiNote: 63, degree: 1},

	{vtNote:"E@/4", name:"es1", syllable:"mi-bemoll1", midiNote: 63, degree: 2},
	{vtNote:"E/4", name:"e1", syllable:"mi1", line: 4, midiNote: 64, degree: 2},
	{vtNote:"E#/4", name:"eis1", syllable:"mi-diees1", midiNote: 65, degree: 2},

	{vtNote:"F@/4", name:"fes1", syllable:"fa-bemoll1", midiNote:64, degree: 3},
	{vtNote:"F/4", name:"f1", syllable:"fa1", line: 3.5, midiNote:65, degree: 3},
	{vtNote:"F#/4", name:"fis1", syllable:"fa-diees1", midiNote:66, degree: 3 },

	{vtNote:"G@/4", name:"ges1", syllable:"sol-bemoll1", midiNote: 66, degree: 4},
	{vtNote:"G/4", name:"g1", syllable:"sol1", line: 3, midiNote: 67, degree: 4},
	{vtNote:"G#/4", name:"gis1", syllable:"sol-diees1", midiNote: 68, degree: 4},

	{vtNote:"A@/4", name:"as1", syllable:"la-bemoll1", midiNote: 68, degree: 5},
	{vtNote:"A/4", name:"a1", syllable:"la1", line: 2.5, midiNote: 69, degree: 5},
	{vtNote:"A#/4", name:"ais1", syllable:"la-diees1", midiNote: 70, degree: 5},

	{vtNote:"B@@/4", name:"heses1", syllable:"si-duubelbemoll1", midiNote: 69, degree: 6}, // test duubelbemolliks
	{vtNote:"B@/4", name:"b1", syllable:"si-bemoll1", midiNote: 70, degree: 6},
	{vtNote:"B/4", name:"h1", syllable:"si1", line: 2, midiNote: 71, degree: 6},
	{vtNote:"B#/4", name:"his1", syllable:"si-diees1", midiNote: 72, degree: 6},


	{vtNote:"C@/5", name:"ces2", syllable:"do-bemoll2", midiNote: 71, degree: 0},
	{vtNote:"C/5", name:"c2", syllable:"do2", line: 1.5, midiNote: 72, degree: 0},
	{vtNote:"C#/5", name:"cis2", syllable:"do-diees2", midiNote: 73, degree: 0},

	{vtNote:"D@/5", name:"des2", syllable:"re-bemoll2", midiNote: 73, degree: 1},
	{vtNote:"D/5", name:"d2", syllable:"re2", line: 1, midiNote: 74, degree: 1},
	{vtNote:"D#/5", name:"dis2", syllable:"re-diees2", midiNote: 75, degree: 1},

	{vtNote:"E@/5", name:"es2", syllable:"mi-bemoll2", midiNote: 75, degree: 2},
	{vtNote:"E/5", name:"e2", syllable:"mi2", line: 0.5, midiNote: 76, degree: 2},
	{vtNote:"E#/5", name:"eis2", syllable:"mi-diees2", midiNote: 77, degree: 2},

	{vtNote:"F@/5", name:"fes2", syllable:"fa-bemoll2", midiNote: 76, degree: 3},
	{vtNote:"F/5", name:"f2", syllable:"fa2", line: 0, midiNote: 77, degree: 3},
	{vtNote:"F#/5", name:"fis2", syllable:"fa-diees2", midiNote: 78, degree: 3},

	{vtNote:"G@/5", name:"ges2", syllable:"sol-bemoll2", midiNote: 78, degree: 4},
	{vtNote:"G/5", name:"g2", syllable:"sol2", line: -0.5, midiNote: 79, degree: 4},
	{vtNote:"G#/5", name:"gis2", syllable:"sol-diees2", midiNote: 80, degree: 4},

	{vtNote:"A@/5", name:"as2", syllable:"la-bemoll2", midiNote: 80, degree: 5},
	{vtNote:"A/5", name:"a2", syllable:"la2", line: -1, midiNote: 81, degree: 5},
	{vtNote:"A#/5", name:"ais2", syllable:"la-diees2", midiNote: 82, degree: 5},

	{vtNote:"B@/5", name:"b2", syllable:"si-bemoll2", midiNote: 82, degree: 6},
	{vtNote:"B/5", name:"h2", syllable:"si2", line: -1.5, midiNote: 83, degree: 6},
	{vtNote:"B#/5", name:"his2", syllable:"si-diees2", midiNote: 84, degree: 6},

	{vtNote:"C@/6", name:"ces3", syllable:"do-bemoll3", midiNote: 83, degree: 0},
	{vtNote:"C/6", name:"c3", syllable:"do3", line: -2, midiNote: 84, degree: 0},
	{vtNote:"C#/6", name:"cis3", syllable:"do-diees3", midiNote: 85, degree: 0}
	];
	
export const bassClefNotes = [   // line - line number in staff: 0 upper, 4 - lower, 5 - lower ledger line. Used to draw the note
	{vtNote:"C@/2", name:"Ces", syllable:"Do-bemoll", midiNote: 35, degree: 0},
	{vtNote:"C/2", name:"C", syllable:"Do", line: 6, midiNote: 36, degree: 0},
	{vtNote:"C#/2", name:"Cis", syllable:"Do-diees", midiNote: 37, degree: 0},

	{vtNote:"D@/2", name:"Des", syllable:"Re-bemoll", midiNote: 37, degree: 1},
	{vtNote:"D/2", name:"D", syllable:"Re", line: 5.5, midiNote: 38, degree: 1},
	{vtNote:"D#/2", name:"Dis", syllable:"Re-diees", midiNote: 39, degree: 1},

	{vtNote:"E@/2", name:"Es", syllable:"Mi-bemoll1", midiNote: 39, degree: 2},
	{vtNote:"E/2", name:"E", syllable:"Mi", line: 5, midiNote: 40, degree: 2},
	{vtNote:"E#/2", name:"Eis", syllable:"Mi-diees", midiNote: 41, degree: 2},

	{vtNote:"F@/2", name:"Fes", syllable:"Fa-bemoll", midiNote:40, degree: 3},
	{vtNote:"F/2", name:"F", syllable:"Fa", line: 4.5, midiNote:41, degree: 3},
	{vtNote:"F#/2", name:"Fis", syllable:"Fa-diees", midiNote:42, degree: 3},

	{vtNote:"G@/2", name:"Ges", syllable:"Sol-bemoll", midiNote: 42, degree: 4},
	{vtNote:"G/2", name:"G", syllable:"Sol", line: 4, midiNote: 43, degree: 4},
	{vtNote:"G#/2", name:"Gis", syllable:"Sol-diees", midiNote: 44, degree: 4},

	{vtNote:"A@/2", name:"As", syllable:"La-bemoll", midiNote: 44, degree: 5},
	{vtNote:"A/2", name:"A", syllable:"La", line: 3.5, midiNote: 45, degree: 5},
	{vtNote:"A#/2", name:"Ais", syllable:"La-diees", midiNote: 46, degree: 5},

	{vtNote:"B@/2", name:"B", syllable:"Si-bemoll1", midiNote: 46, degree: 6},
	{vtNote:"B/2", name:"H", syllable:"Si", line: 3, midiNote: 47, degree: 6},
	{vtNote:"B#/2", name:"His", syllable:"Si-diees", midiNote: 48, degree: 6},


	{vtNote:"C@/3", name:"ces", syllable:"do-bemoll", midiNote: 47, degree: 0},
	{vtNote:"C/3", name:"c", syllable:"do", line: 2.5, midiNote: 48, degree: 0},
	{vtNote:"C#/3", name:"cis", syllable:"do-diees", midiNote: 49, degree: 0},

	{vtNote:"D@/3", name:"des", syllable:"re-bemoll", midiNote: 49, degree: 1},
	{vtNote:"D/3", name:"d", syllable:"re", line: 2, midiNote: 50, degree: 1},
	{vtNote:"D#/3", name:"dis", syllable:"re-diees", midiNote: 51, degree: 1},

	{vtNote:"E@/3", name:"es", syllable:"mi-bemoll", midiNote: 51, degree: 2},
	{vtNote:"E/3", name:"e", syllable:"mi", line: 1.5, midiNote: 52, degree: 2},
	{vtNote:"E#/3", name:"eis", syllable:"mi-diees", midiNote: 53, degree: 2},

	{vtNote:"F@/3", name:"fes", syllable:"fa-bemoll", midiNote: 52, degree: 3},
	{vtNote:"F/3", name:"f", syllable:"fa", line: 1, midiNote: 53, degree: 3},
	{vtNote:"F#/3", name:"fis", syllable:"fa-diees", midiNote: 54, degree: 3},

	{vtNote:"G@/3", name:"ges", syllable:"sol-bemoll", midiNote: 54, degree: 4},
	{vtNote:"G/3", name:"g", syllable:"sol", line: 0.5, midiNote: 55, degree: 4},
	{vtNote:"G#/3", name:"gis", syllable:"sol-diees", midiNote: 56, degree: 4},

	{vtNote:"A@/3", name:"as", syllable:"la-bemoll", midiNote: 56, degree: 5},
	{vtNote:"A/3", name:"a", syllable:"la", line: 0, midiNote: 57, degree: 5},
	{vtNote:"A#/3", name:"ais", syllable:"la-diees", midiNote: 58, degree: 5},

	{vtNote:"B@/3", name:"b", syllable:"si-bemoll", midiNote: 58, degree: 6},
	{vtNote:"B/3", name:"h", syllable:"si", line: -0.5, midiNote: 59, degree: 6},
	{vtNote:"B#/3", name:"his", syllable:"si-diees", midiNote: 60, degree: 6},

	{vtNote:"C@/4", name:"ces1", syllable:"do-bemoll1", midiNote: 59, degree: 0},
	{vtNote:"C/4", name:"c1", syllable:"do1", line: -1, midiNote: 60, degree: 0},
	{vtNote:"C#/4", name:"cis1", syllable:"do-diees1", midiNote: 61, degree: 0}
	];
	
export const trebleClefNotes = violinClefNotes; // convenience overload;

export const getNoteByName = (name, noteArray=trebleClefNotes) =>  noteArray.find(note => note.name === name);

export const getNotesByMidiNote = (midiNote, noteArray=trebleClefNotes) => { // return an array of note objects, i.e cis and des for 61
	return noteArray.find(note => note.midiNote === midiNote);
};

export const getNoteByVtNote = (vtNote, noteArray=trebleClefNotes) => {
	return noteArray.find(note => note.vtNote === vtNote);
};


export const parseLilypondString = (lyString) => { //NB! rewrite! returns notationInfo object -  see notationConstant defaultNotationInfo
	const chunks = lyString.trim().replace(/\s\s+/g, ' ').split(" "); // simplify string
	//let vtNotes = "";
	let notationInfo = defaultNotationInfo;
	let stave=0, voice=0;
	let notes = [] ; // each note has format {keys:[], duration: ""}
	let useTie = false;
	let lastDuration = "4";
	// TODO (tarmo): support for \new Staff and \new Voice (at least Staff). Currently works only with one voice
	for (let i = 0; i<chunks.length; i++) {
		let vtNote="";
		if (chunks[i].trim() === "\\key" && chunks.length >= i+1 ) { // must be like "\key a \major\minor
			console.log("key: ", chunks[i+1], chunks[i+2]);
			let vtKey = noteNames.get(chunks[i+1].toLowerCase());
			if (vtKey) {
				vtKey.replace("@","b"); // key siganture does not want @ but b for flat
				if (chunks[i+2]=="\\minor") {
					vtKey += "m"
				}
				notationInfo.staves[stave].key = vtKey;
				console.log("Converted key:", vtKey)
			} else {
				console.log("Could not find notename for: ", chunks[i+1])
			}
			i += 2;
		} else if (chunks[i].trim() === "\\time" && chunks.length >= i+1) { // must be like "\key a \major
			console.log("time: ", chunks[i + 1]);
			notationInfo.staves[stave].time = chunks[i + 1];
			i += 1;
			// VT nt: time=2/4
		} else if (chunks[i].trim() === "\\clef" && chunks.length >= i+1) {
			console.log("clef: ", chunks[i + 1]);
			notationInfo.staves[stave].clef = chunks[i + 1];
			i += 1;
			// VT nt: clef=treble
		} else if  (chunks[i].trim() === "\\bar" && chunks.length >= i+1)  { // handle different barlines
			const barLine = chunks[i + 1].trim().replace(/[\"]+/g, ''); // remove quoates \"

			console.log("Found barline: ", barLine);
			let vtBar = "";
			switch (barLine) {
				case '|' : console.log("Normal bar"); vtBar = "|"; break;
				case '|.' : console.log("End bar"); vtBar = "=|="; break;
				case '||' : console.log("Double bar"); vtBar += "=||"; break;
				case '.|:' : console.log("Repeat begins"); vtBar += "=|:"; break;
				case ':|.' : console.log("Repeat ends"); vtBar += " =:||"; break;
				case ':|.|:' : console.log("Double repeat"); vtBar += "=::"; break;
				default : console.log("Normal bar"); vtBar += "|"; break;

			}
			notes.push({keys:[vtBar], duration:"0"});
			i += 1;
		} else if     (chunks[i].trim() === "|") {
			console.log("Barline");
			//vtNote = "|";
			notes.push({keys:["|"], duration:"0"});
		} else  { // might be a note or error
			let vtNote="";
			const index = chunks[i].search(/[~,'\\\d\s]/); // in lylypond one of those may follow th note: , ' digit \ whitespace or nothing
			let noteName;
			if (index>=0) {
				noteName = chunks[i].slice(0, index);
			} else {
				noteName = chunks[i].toLowerCase();
			}
			//let vtNote = "";

			if (noteName === "r") { // rest
				vtNote = "##";
			} else {

				if (! noteNames.has(noteName)) { // ERROR
					alert(noteName +  " is not a recognized note or keyword."); // TODO: translate!
					break;
				}
				console.log("noteName is: ", noteName);
				vtNote = noteNames.get(noteName);

				//TODO: octave from relative writing
				let octave;
				// use better regexp and test for '' ,, etc
				if (chunks[i].search("\'")>=0) {
					octave = "5";
				} else if (chunks[i].search(",")>=0) {
					octave ="3";
				} else {
					octave = "4";
				}

				vtNote += "/" + octave;
			}


			// tie - in lilypond ~ is on first note, in VT h after the duration of next one
			// NB! untested in  new notationInfo context!
			if (useTie) {
				vtNote = " h " + vtNote; // for held note/legato
				useTie = false;
			}

			// check for tie to apply it to next note:
			if (chunks[i].includes("~")) {
				useTie = true;
			} else {
				useTie = false;
			}

			// duration
			const re = /\d+/;
			const duration = re.exec(chunks[i]);
			if (duration) {
				lastDuration = duration;
			}


			// if (duration) {
			// 	vtNote = ":" + duration + " " + vtNote + " ";  //` :${duration} ${vtNote}. `; // in VT duration is before note(s)
			// } else if (useTie) {
			//
			// }

			console.log("vtNote: ", vtNote);
			notes.push({keys:[vtNote], duration:lastDuration});

		}

	}
	//console.log("Parsed notes: ", vtNotes);
	notationInfo.staves[stave].voices[voice].notes = notes;
	return notationInfo;
};





