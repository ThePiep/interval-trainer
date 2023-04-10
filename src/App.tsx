import React, { useRef, useState } from 'react'
import './App.css'
import MIDISounds from 'midi-sounds-react';
import * as TonalNote from 'tonal-note';

interface Note {
  name: string
  value: number
}

interface IntervalNote {
  name: string
  interval: number
}

const App = (): JSX.Element => {
  const [midiSounds, setMidiSounds] = useState<any>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timer>();

  const [root, setRoot] = useState(48);
  const rootRef = useRef(root);
  rootRef.current = root;

  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set([2, 4, 5, 7]));
  const activeNotesRef = useRef(activeNotes);
  activeNotesRef.current = activeNotes;

  const interval: IntervalNote[] = [
    { interval: 0, name: 'root' },
    { interval: 2, name: '2nd' },
    { interval: 3, name: 'minor 3rd' },
    { interval: 4, name: 'major 3rd' },
    { interval: 5, name: '4th' },
    { interval: 7, name: '5th' },
    { interval: 8, name: 'minor 6th' },
    { interval: 9, name: 'major 6th' },
    { interval: 10, name: 'minor 7th' },
    { interval: 11, name: 'major 7th' },
    { interval: 12, name: 'octave' }
  ]

  const playNotes = (): void => {
    midiSounds.playStrumDownNow(378, [rootRef.current], 0.8);

    setTimeout(() => {
      if (intervalRef.current === undefined) {
        return
      }
      if (activeNotesRef.current.size === 0) {
        stop()
      } else {
        midiSounds.playStrumDownNow(378, [getRandomNote()], 1);
      }
    }, 1400);
  }

  const start = (): void => {
    setIsPlaying(true);
    if (intervalRef.current != null) {
      return
    }
    playNotes();
    const i = setInterval(() => {
      playNotes();
    }, 5500)
    clearInterval(intervalRef.current)
    intervalRef.current = i;
  }

  const stop = (): void => {
    setIsPlaying(false);
    clearInterval(intervalRef.current)
    intervalRef.current = undefined; // cleanup
  }

  const getRandomNote = (): number => {
    const interval = Math.floor(Math.random() * activeNotesRef.current.size);
    const keys = Array.from(activeNotesRef.current)
    const randomNote = keys[interval] + rootRef.current;
    return randomNote;
  }

  const toggleActiveInterval = (interval: number): void => {
    setActiveNotes((prev) => {
      const next = new Set(prev);
      if (!prev.has(interval)) {
        next.add(interval);
      } else {
        next.delete(interval)
      }
      return next;
    });
  }

  const selectRoot = (): JSX.Element => {
    const octave = 3;
    return <>
      <label htmlFor='root-selector'>Root: </label>
      <select name='root-selector'>{TonalNote.names(' #').map((name) => {
        const midiValue = TonalNote.midi(name + octave.toString());
        return <option
          key={midiValue}
          onClick={() => { setRoot(midiValue ?? 48); }}
        >
          {name}{octave}
        </option>;
      }
      )}</select>
    </>
  }

  const selectInterval = (): JSX.Element[] => {
    return interval.map((elem) => {
      return <button
        key={elem.interval}
        onClick={() => { toggleActiveInterval(elem.interval); }}
        className={activeNotes.has(elem.interval) ? 'selected' : ''}
      >
        {elem.name}
      </button>
    });
  }

  return (
    <div className="App">
      <h1>Bass interval trainer</h1>
      <div className="card">
        <button onClick={() => { isPlaying ? stop() : start() }}>
          {isPlaying ? 'Stop' : 'Start'} interval
        </button>
        {/* <p>Select root:</p> */}
        <p>{selectRoot()}</p>
        <p>Select interval:</p>
        {selectInterval()}
        <p>
          Presets:
        </p>
        <p>
          <button onClick={() => { setActiveNotes(new Set([0, 5, 7])); }}>i-iv-v</button>
          <button onClick={() => { setActiveNotes(new Set([2, 4, 5, 7])); }}>ii-iii-iv-v</button>
          <button onClick={() => { setActiveNotes(new Set([2, 4, 5, 7, 9, 11, 12])) }}>Major Scale</button>
          <button onClick={() => { setActiveNotes(new Set([2, 3, 5, 7, 8, 10, 12])); }}>Minor Scale</button>
        </p>
      </div>
      <span style={{ display: 'none' }}>

        <MIDISounds ref={(ref) => { setMidiSounds(ref); }} appElementName="root" instruments={[3, 375, 376, 377, 378]} />
      </span>
    </div >
  )
}

export default App
