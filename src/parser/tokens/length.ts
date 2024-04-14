import type {Character} from '../lines'
import {eatChar, eatNaturalNumber} from './eat'

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
export function eatLength(chars: Character[], i: number): [Length | null, number] {
  const i0 = i
  const [l, i1] = eatChar(chars, i, ['l'])
  const [noteValue, i2] = eatNaturalNumber(chars, i1)

  if (l === null) {
    return [null, i]
  }

  const startLn = chars[i0].ln
  const startCn = chars[i0].cn

  if (noteValue === null) {
    throw new Error(
      `[ syntax error ] The note value is not found: ${startLn} line, ${startCn} char.`
    )
  }
  if (startLn !== chars[i1].ln) {
    throw new Error(
      `[ syntax error ] The note value is not found on the same line: ${startLn} line, ${startCn} char.`
    )
  }

  const envelope: Length = {
    startLn: startLn,
    startCn: startCn,
    noteValue: noteValue,
  }
  return [envelope, i2]
}
