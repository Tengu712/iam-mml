import type {Character} from '../lines'
import {eatNaturalNumber} from './eat'

export type Length = {
  startLn: number
  startCn: number
  noteValue: number
}

/**
 * A function to eat a length on the same line.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the eaten octave and the next index.
 * @throws an error when the length number is not found.
 */
export function eatLength(
  chars: Character[],
  i: number
): [Length | null, number] {
  if (i >= chars.length || chars[i].c !== 'l') {
    return [null, i]
  }
  const startLn = chars[i].ln
  const startCn = chars[i].cn
  const i0 = i
  const i1 = i0 + 1
  if (i1 >= chars.length || chars[i1].ln !== startLn) {
    throw new Error(
      `[ syntax error ] The length number is not found on the same line.: ${startLn} line, ${startCn} char.`
    )
  }
  const [noteValue, i2] = eatNaturalNumber(chars, i1)
  if (noteValue === null) {
    throw new Error(
      `[ syntax error ] The length number is not found.: ${startLn} line, ${startCn} char.`
    )
  }
  const envelope: Length = {
    startLn: startLn,
    startCn: startCn,
    noteValue: noteValue,
  }
  return [envelope, i2]
}
