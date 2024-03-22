import type {Character} from '../lines'
import {eatNaturalNumber} from './eat'

export type Octave = {
  startLn: number
  startCn: number
  octave: number
}

/**
 * A function to eat an octave on the same line.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the eaten octave and the next index.
 * @throws an error when the octave number is not found.
 */
export function eatOctave(
  chars: Character[],
  i: number
): [Octave | null, number] {
  if (i >= chars.length || chars[i].c !== 'o') {
    return [null, i]
  }
  const startLn = chars[i].ln
  const startCn = chars[i].cn
  const i0 = i
  const i1 = i0 + 1
  if (i1 >= chars.length || chars[i1].ln !== startLn) {
    throw new Error(
      `[ syntax error ] The octave number is not found on the same line.: ${startLn} line, ${startCn} char.`
    )
  }
  const [octave, i2] = eatNaturalNumber(chars, i1)
  if (octave === null) {
    throw new Error(
      `[ syntax error ] The octave number is not found.: ${startLn} line, ${startCn} char.`
    )
  }
  const envelope: Octave = {
    startLn: startLn,
    startCn: startCn,
    octave: octave,
  }
  return [envelope, i2]
}
