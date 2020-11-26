import React, {useState} from 'react';
import {Table, Image, Button, Popup, Accordion, Icon} from 'semantic-ui-react';
import {vtNames, octaveData} from './notationConstants';

const NotationTable = ({addNote, removeNote, selected, setters}) => {

  const [showTable, setShowTable] = useState(false);
  const [iconClass, setIconClass] = useState("iconDown");

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

  // this is to get a fancy animation when accordionblock's opening
  const onTitleClick = () => {
<<<<<<< HEAD
    toggleTable();
=======
>>>>>>> 34418e79d7f877bdc506decff5306ce39b7e63b5
    if (iconClass === "iconDown") {
      setIconClass("iconUp");
    } else {
      setIconClass("iconDown");
    }
  }

<<<<<<< HEAD
  const toggleTable = () => {
    setShowTable(!showTable);
  }

=======
>>>>>>> 34418e79d7f877bdc506decff5306ce39b7e63b5
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

  const toggleTable = () => {
    setShowTable(!showTable);
  }

  return(
    <div style={{paddingTop: '1rem'}}>
<<<<<<< HEAD
      <Accordion styled active={showTable}>
=======
      <Accordion styled active={showTable} onClick={toggleTable}>
>>>>>>> 34418e79d7f877bdc506decff5306ce39b7e63b5
        <Accordion.Title onClick={onTitleClick} >
          <Icon className={'chevron down ' + iconClass} id={'toggleTableIcon'} />
        </Accordion.Title>
        <Accordion.Content active={showTable} id={'notationTableContent'}>
          <Table unstackable >
            <Table.Body>
              <Table.Row>
                <Table.Cell textAlign='center' width='2' />
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
              <Table.Cell textAlign='center' width='2' />
                <NotationTableCell name={'dblflat'} handleClick={onNoteAccidentalClick} checkIfSelected={isNoteAccidentalSelected} />
                <NotationTableCell name={'flat'} handleClick={onNoteAccidentalClick} checkIfSelected={isNoteAccidentalSelected} />
                <NotationTableCell name={'nat'} handleClick={onNoteAccidentalClick} checkIfSelected={isNoteAccidentalSelected} />
                <NotationTableCell name={'sharp'} handleClick={onNoteAccidentalClick} checkIfSelected={isNoteAccidentalSelected} />
                <NotationTableCell name={'dblsharp'} handleClick={onNoteAccidentalClick} checkIfSelected={isNoteAccidentalSelected} />
                <Table.Cell textAlign='center' width='2' />
                <Table.Cell textAlign='center' width='2' />
              </Table.Row>
              <Table.Row>
                <Table.Cell textAlign='center' width='2' />
                <Table.Cell textAlign='center' width='2' />
                <Table.Cell textAlign='center' width='2' />
                <NotationTableCell name={'octaveup'} handleClick={onOctaveUpClick} popupContent={'Oktav kõrgemaks'} />
                <NotationTableCell name={'octavedown'} handleClick={onOctaveDownClick} popupContent={'Oktav madalamaks'} />
                <Table.Cell textAlign='center' width='2' />
                <Table.Cell textAlign='center' width='2' />
                <Table.Cell textAlign='center' width='2' />
              </Table.Row>
            </Table.Body>
          </Table>
          <Button onClick={addNote}>Lisa noot</Button>
          <Button onClick={() => removeNote()}>Kustuta viimane</Button>
        </Accordion.Content>
      </Accordion>
  </div>
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

