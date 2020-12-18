import {Artist, VexTab} from 'vextab/releases/vextab-div';

let width = 600;

export const setWidth = newWidth => {
  width = newWidth;
}

export let scale = 1;

export const setScale = newScale => {
  scale = newScale;
}

export const artist = new Artist(10, 10, width, {scale: scale});
Artist.NOLOGO = true;

export const vexTab = new VexTab(artist);

export const createVexTabString = (props, notes) => {
  const startString = "stave "; //"options space=20\n stave \n ";
  const clefString = (props.clef) ? "clef="+props.clef+"\n" : "";
  const keyString = (props.keySignature) ? "key="+props.keySignature+"\n" : "";
  const timeString = (props.time) ?  "time="+props.time+"\n" : "";
  const notesString =  (notes) ? "\nnotes " + notes + " \n" : "";
  const endString = ""; //"\noptions space=20\n";
  const vtString = startString + clefString + keyString + timeString + notesString + endString;
  return vtString;
};