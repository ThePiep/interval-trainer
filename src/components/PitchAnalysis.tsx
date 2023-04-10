import React, { useRef, useState } from 'react'
import PitchAnalyser from 'pitch-analyser'

export const PitchAnalysis = (): JSX.Element => {
  const [note, setNote] = useState();
  const [frequency, setFrequency] = useState();
  const [cents, setCents] = useState();

  const analyser = useRef(new PitchAnalyser({
    callback: function (payload) {
      setNote(payload.note)
      setFrequency(payload.frequency)
      setCents(payload.cents)
    }
  }));

  const start = (): void => {
    analyser.current.initAnalyser().then(() => {
      // Start the analyser after initialisation
      analyser.current.startAnalyser();
    });
  }

  const resume = (): void => {
    if (analyser.current.audioContext.state === 'suspended') {
      analyser.current.resumeAnalyser();
    }
  }

  const pauze = (): void => {
    if (analyser.current.audioContext.state === 'running') {
      analyser.current.pauseAnalyser();
    }
  }

  return <>
    <button onClick={() => { start(); }}>
      Start analysis
    </button>
    <button onClick={() => { pauze(); }}>
      Pauze
    </button>
    <button onClick={() => { resume(); }}>
      Resume
    </button>
    <p>Note: {note} Freq: {frequency}
      {/* Cents: {cents} */}
    </p>
  </>
}
