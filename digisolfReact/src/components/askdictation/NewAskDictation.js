import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as constants from './dictationConstants';
import { defaultNotationInfo } from '../notation/notationUtils';
import CsoundObj from "@kunstmusik/csound"; 
import {dictationOrchestra as orc} from "../../csound/orchestras";

const NewAskDictation = () => {
  // level, type
  const type = useParams().name;
  const isDegreeDictation = type === constants.categories.DEGREES;
  const isRandomDegreeDictation = type === constants.categories.DEGREES_RANDOM;
  const level = 1; // TODO 4.12.2020 : get level from radio input in MainMenu

  // csound ======================================================================
  const [csound, setCsound] = useState(null);
  const [csoundLoading, setCsoundLoading] = useState(true);

  useEffect(() => {
    let initialized = true;
    if (isDegreeDictation && csound === null) {
      CsoundObj.initialize().then(() => {
        if (initialized) {
          setCsound(new CsoundObj());
          setCsoundLoading(false);
        }
      });
    }

    return () => (initialized = false)
  }, []);

  const startCsound = async () => {
    await loadCsoundResources(60, 84, "flute");
    csound.setOption("-m0d")
    csound.compileOrc(orc);
    csound.start();
    csound.audioContext.resume();
  };

  async function loadCsoundResources(startingNote, endingNote, instrument) {
    if (!csound) {
        return false;
    }
    for (let i = startingNote; i <= endingNote; i++) {
        const fileUrl = "sounds/instruments/" + instrument + "/" + i + ".ogg";
        const serverUrl = `${process.env.PUBLIC_URL}/${fileUrl}`;
        const file = await fetch(serverUrl);
        const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        const path = `${fileName}`;
        const buffer = await file.arrayBuffer();
        await csound.writeToFS(path, buffer);
    }
    return true;
  }

  // correctNotation ============================================================
  const [showCorrectNotation, setShowCorrectNotation] = useState(false);

  let correctNotation = defaultNotationInfo;

  

  return (
    <div>
      <div>{csoundLoading ? <p>loading...</p> : <p>Fetched!!</p>}</div>
      {console.log('type', isDegreeDictation)}
    </div> 
  );
}

export default NewAskDictation;