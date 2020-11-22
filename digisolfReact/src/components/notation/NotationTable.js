import React from 'react';
import {Table, Image, Button, Popup} from 'semantic-ui-react';
import {vtNames, octaveData} from './notationConstants';

const NotationTable = ({addNote, removeNote, selected, setters}) => {

  const onNoteClick = name => {
    setters.setNote(name);
  }

  const onRestClick = name => {
    setters.setNote(vtNames[name]);
  }

  const onNoteAccidentalClick = name => {
    setters.setAccidental(vtNames[name]);
  }

  const onNoteDurationClick = name => {
    setters.setDuration(vtNames[name]);
  }

  const onDotClick = name => {
    setters.setDot(vtNames[name]);
  }

  const onOctaveUpClick = () => {
    let octave = parseInt(selected.octave);
    if (octave < octaveData.maxOctave) {
      octave++;
      setters.setOctave(octave.toString());
    }
  }

  const onOctaveDownClick = () => {
    let octave = parseInt(selected.octave);
    if (octave > octaveData.minOctave) {
      octave--;
      setters.setOctave(octave.toString());
    }
  }

  const isNoteSelected = name => {
    return name === selected.note;
  }

  const isRestSelected = name => {
    return vtNames[name] === selected.note;
  }

  const isNoteAccidentalSelected = name => {
    return vtNames[name] === selected.accidental;
  }

  const isNoteDurationSelected = name => {
    return vtNames[name] === selected.duration;
  }

  const isDotSelected = () => {
    return selected.dot !== "";
  }

  return(
    <React.Fragment>
      <Table style={{overflowX: 'scrollable'}}>
        <Table.Body>
          <Table.Row>
            <Table.Cell textAlign='center' width='2'/>
            <NotationTableCell name={'whole'} handleClick={onNoteDurationClick} checkIfSelected={isNoteDurationSelected} />
            <NotationTableCell name={'half'} handleClick={onNoteDurationClick} checkIfSelected={isNoteDurationSelected} />
            <NotationTableCell name={'quarter'} handleClick={onNoteDurationClick} checkIfSelected={isNoteDurationSelected} />
            <NotationTableCell name={'eighth'} handleClick={onNoteDurationClick} checkIfSelected={(isNoteDurationSelected)} />
            <NotationTableCell name={'sixteenth'} handleClick={onNoteDurationClick} checkIfSelected={isNoteDurationSelected} />
            <NotationTableCell name={'dot'} handleClick={onDotClick} checkIfSelected={isDotSelected} />
          </Table.Row>
          <Table.Row>
            <NotationTableCell name={'C'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
            <NotationTableCell name={'D'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
            <NotationTableCell name={'E'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
            <NotationTableCell name={'F'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
            <NotationTableCell name={'G'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
            <NotationTableCell name={'A'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
            <NotationTableCell name={'B'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
            <NotationTableCell name={'rest'} handleClick={onRestClick} checkIfSelected={isRestSelected} />
        </Table.Row>
        <Table.Row>
          <Table.Cell textAlign='center' width='2'/>
          <NotationTableCell name={'dblflat'} handleClick={onNoteAccidentalClick} checkIfSelected={isNoteAccidentalSelected} />
          <NotationTableCell name={'flat'} handleClick={onNoteAccidentalClick} checkIfSelected={isNoteAccidentalSelected} />
          <NotationTableCell name={'nat'} handleClick={onNoteAccidentalClick} checkIfSelected={isNoteAccidentalSelected} />
          <NotationTableCell name={'sharp'} handleClick={onNoteAccidentalClick} checkIfSelected={isNoteAccidentalSelected} />
          <NotationTableCell name={'dblsharp'} handleClick={onNoteAccidentalClick} checkIfSelected={isNoteAccidentalSelected} />
          <Table.Cell textAlign='center' width='2'/>
          <Table.Cell textAlign='center' width='2'/>
        </Table.Row>
        <Table.Row>
          <Table.Cell textAlign='center' width='2'/>
          <Table.Cell textAlign='center' width='2'/>
          <Table.Cell textAlign='center' width='2'/>
          <NotationTableCell name={'octaveup'} handleClick={onOctaveUpClick} popupContent={'Oktav kõrgemaks'} />
          <NotationTableCell name={'octavedown'} handleClick={onOctaveDownClick} popupContent={'Oktav madalamaks'} />
          <Table.Cell textAlign='center' width='2'/>
          <Table.Cell textAlign='center' width='2'/>
          <Table.Cell textAlign='center' width='2'/>
        </Table.Row>
      </Table.Body>
    </Table>
    <Button onClick={addNote}>Lisa noot</Button>
    <Button onClick={() => removeNote()}>Kustuta viimane</Button>
  </React.Fragment>
  );
};

export default NotationTable;

const NotationTableCell = ({name, handleClick, checkIfSelected, isImageCell=true, popupContent}) => {

  const isActive = checkIfSelected && checkIfSelected(name);

  const cell = <Table.Cell selectable active={isActive} onClick={() => handleClick(name)} textAlign='center' width='2' style={{cursor: 'pointer'}}>
                {isImageCell ? 
                  <Image src={require('../../images/notes/' + name + '.png')} style={{margin: 'auto', padding: '5px'}}/> :
                  <div style={{padding: '10px'}}>{name}</div>}
              </Table.Cell>
  
  return(
    <React.Fragment>
          {popupContent ? <Popup content={popupContent} trigger={cell} position={'top center'} /> : cell}
    </React.Fragment>
  );
};

