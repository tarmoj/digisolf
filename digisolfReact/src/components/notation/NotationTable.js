import React, {useState} from 'react';
import {Table, Image} from 'semantic-ui-react';

const NotationTable = () => {

  const [selectedNoteLength, setSelectedNoteLength] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedNoteAlteration, setSelectedNoteAlteration] = useState(null);

  const onNoteLengthClick = name => {
    setSelectedNoteLength(name);
  }

  const onNoteClick = name => {
    setSelectedNote(name);
  }

  const onNoteAlterationClick = name => {
    setSelectedNoteAlteration(name);
  }

  const isNoteLengthSelected = name => {
    return name === selectedNoteLength;
  }

  const isNoteSelected = name => {
    return name === selectedNote;
  }

  const isNoteAlterationSelected = name => {
    return name === selectedNoteAlteration;
  }

  return(
    <Table size='large'>
      <Table.Body>
        <Table.Row>
          <NotationTableCell name={'whole'} handleClick={onNoteLengthClick} checkIfSelected={isNoteLengthSelected} />
          <NotationTableCell name={'half'} handleClick={onNoteLengthClick} checkIfSelected={isNoteLengthSelected} />
          <NotationTableCell name={'quarter'} handleClick={onNoteLengthClick} checkIfSelected={isNoteLengthSelected} />
          <NotationTableCell name={'eighth'} handleClick={onNoteLengthClick} checkIfSelected={(isNoteLengthSelected)} />
          <NotationTableCell name={'sixteenth'} handleClick={onNoteLengthClick} checkIfSelected={isNoteLengthSelected} />
          <NotationTableCell name={'dot'} handleClick={onNoteLengthClick} checkIfSelected={isNoteLengthSelected} />
          <NotationTableCell name={'rests'} handleClick={onNoteLengthClick} checkIfSelected={isNoteLengthSelected} />
        </Table.Row>
        <Table.Row>
          <NotationTableCell name={'C'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
          <NotationTableCell name={'D'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
          <NotationTableCell name={'E'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
          <NotationTableCell name={'F'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
          <NotationTableCell name={'G'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
          <NotationTableCell name={'A'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
          <NotationTableCell name={'B'} handleClick={onNoteClick} checkIfSelected={isNoteSelected} isImageCell={false} />
      </Table.Row>
      <Table.Row>
        <Table.Cell textAlign='center' width='2'/>
        <NotationTableCell name={'dblflat'} handleClick={onNoteAlterationClick} checkIfSelected={isNoteAlterationSelected} />
        <NotationTableCell name={'flat'} handleClick={onNoteAlterationClick} checkIfSelected={isNoteAlterationSelected} />
        <NotationTableCell name={'nat'} handleClick={onNoteAlterationClick} checkIfSelected={isNoteAlterationSelected} />
        <NotationTableCell name={'sharp'} handleClick={onNoteAlterationClick} checkIfSelected={isNoteAlterationSelected} />
        <NotationTableCell name={'dblsharp'} handleClick={onNoteAlterationClick} checkIfSelected={isNoteAlterationSelected} />
        <Table.Cell textAlign='center' width='2'/>
      </Table.Row>
    </Table.Body>
  </Table>
  );
};

export default NotationTable;

const NotationTableCell = ({name, handleClick, checkIfSelected, isImageCell=true}) => {

  const isActive = checkIfSelected(name);

  return(
    <Table.Cell selectable active={isActive} onClick={() => handleClick(name)} textAlign='center' width='2' style={{cursor: 'pointer'}}>
      {isImageCell? 
        <Image src={require('../../images/notes/' + name + '.png')} style={{margin: 'auto', padding: '5px'}}/> :
        <div style={{padding: '10px'}}>{name}</div>}
    </Table.Cell>
  );
};