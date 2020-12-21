import React, {useState, useEffect} from 'react';
import {Table, Image, Button, Popup, Accordion, Icon} from 'semantic-ui-react';
import {vtNames, octaveData} from './notationUtils';
import {useSelector, useDispatch} from 'react-redux';
import {setSelected, insertNote, removeNote} from '../../actions/askDictation';

const NotationInput = () => {

  const [showTable, setShowTable] = useState(false);
  const [iconClass, setIconClass] = useState("iconDown");

  const selectedNote = useSelector(state => state.askDictationReducer.selectedNote);
  const selectedNoteSet = useSelector(state => state.askDictationReducer.selectedNoteSet);

  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  useEffect(() => {
    // Select default values
    onNoteDurationClick("quarter");
  }, []);

  const onKeyDown = (e) => {
    const noteNameKeys = ["c", "d", "e", "f", "g", "a", "b"];
    if (noteNameKeys.includes(e.key)) {
      onNoteClick(e.key.toUpperCase());
    } else if (e.key === "1") {
      onNoteDurationClick("whole");
    } else if (e.key === "2") {
      onNoteDurationClick("half");
    } else if (e.key === "3") {
      onNoteDurationClick("quarter");
    } else if (e.key === "4") {
      onNoteDurationClick("eighth");
    } else if (e.key === "5") {
      onNoteDurationClick("sixteenth");
    } else if (e.key === "6") {
      onDotClick("dot");
    } else if (e.key === "0") {
      onRestClick("rest");
    } else if (e.key === "n") {
      onNoteAccidentalClick("dblflat");
    } else if (e.key === "m") {
      onNoteAccidentalClick("flat");
    } else if (e.key === ",") {
      onNoteAccidentalClick("nat");
    } else if (e.key === ".") {
      onNoteAccidentalClick("sharp");
    } else if (e.key === "-") {
      onNoteAccidentalClick("dblsharp");
    } else if (e.key === "ArrowUp") {
      onOctaveUpClick();
    } else if (e.key === "ArrowDown") {
      onOctaveDownClick();
    // } else if (e.key === "Enter") {
    //   onAddNoteClick();
    } else if (e.key === "Backspace") {
      onRemoveNoteClick();
    }
  };

  const onNoteClick = name => {
    dispatch(setSelected("note", name));
    if (!selectedNoteSet) {
      dispatch(insertNote());
    }
  }

  const onRestClick = name => {
    dispatch(setSelected("note", vtNames[name]));
  }

  const onNoteAccidentalClick = name => {
    if (selectedNote.accidental === vtNames[name]) {
      dispatch(setSelected("accidental", ""));
    } else {
      dispatch(setSelected("accidental", vtNames[name]));
    }
  }

  const onNoteDurationClick = name => {
    dispatch(setSelected("duration", vtNames[name]));
  }

  const onDotClick = () => {
    dispatch(setSelected("dot", !selectedNote.dot));
  }

  const onOctaveUpClick = () => {
    let octave = parseInt(selectedNote.octave);
    if (octave < octaveData.maxOctave) {
      octave++;
      dispatch(setSelected("octave", octave.toString()));
    }
  }

  const onOctaveDownClick = () => {
    let octave = parseInt(selectedNote.octave);
    if (octave > octaveData.minOctave) {
      octave--;
      dispatch(setSelected("octave", octave.toString()));
    }
  }

  // this is to get a fancy animation when accordionblock's opening
  const onTitleClick = () => {
    toggleTable();
    if (iconClass === "iconDown") {
      setIconClass("iconUp");
    } else {
      setIconClass("iconDown");
    }
  }

  // const onAddNoteClick = () => {
  //   dispatch(insertNote());
  // }

  const onRemoveNoteClick = () => {
    dispatch(removeNote());
  }

  const toggleTable = () => {
    setShowTable(!showTable);
  }

  const isNoteSelected = name => {
    return name === selectedNote.note;
  }

  const isRestSelected = name => {
    return vtNames[name] === selectedNote.note;
  }

  const isNoteAccidentalSelected = name => {
    return vtNames[name] === selectedNote.accidental;
  }

  const isNoteDurationSelected = name => {
    return vtNames[name] === selectedNote.duration;
  }

  return(
    <div style={{paddingTop: '1rem'}}>
      <Accordion styled active={showTable}>
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
                <NotationTableCell name={'dot'} handleClick={onDotClick} checkIfSelected={() => selectedNote.dot} />
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
          {/*<Button onClick={onAddNoteClick}>Lisa noot</Button>*/}
          <Button onClick={onRemoveNoteClick}>Kustuta</Button>
        </Accordion.Content>
      </Accordion>
  </div>
  );
};

export default NotationInput;

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

