import React from 'react';
import * as TonalNote from 'tonal-note';

interface Props {
  root: number
  setRoot: React.Dispatch<React.SetStateAction<number>>
}

export const SelectRoot = ({ root, setRoot }: Props): JSX.Element => {
  const octave = 3;
  return <>
    <label htmlFor='root-selector'>Root: </label>
    <select
      name='root-selector'
      value={root}
      onChange={(e) => { setRoot(Number(e.target.value) ?? 48); }}>
      {TonalNote.names(' #').map((name) => {
        const midiValue = TonalNote.midi(name + octave.toString());
        return <option
          key={midiValue}
          value={midiValue ?? 48}
        >
          {name}{octave}
        </option>;
      }
      )}</select>
  </>
}
