import type {Character} from '../lines'
import {eatChar, eatNaturalNumber} from './eat'

export type OctaveCommand = '<' | '>' | null

export type Octave = {
  startLn: number
  startCn: number
  command: OctaveCommand
  octave: number
}

function eatOctaveCommand(chars: Character[], i: number): [Octave | null, number] {
  const i0 = i
  const [oc, i1] = eatChar(chars, i0, ['<', '>'])

  if (oc === null) {
    return [null, i0]
  }

  const envelope: Octave = {
    startLn: chars[i0].ln,
    startCn: chars[i0].cn,
    command: oc as OctaveCommand,
    octave: 0,
  }
  return [envelope, i1]
}

/**
 * A function to eat an octave on the same line.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the eaten octave and the next index.
 * @throws an error when the octave number is not found.
 */
export function eatOctave(chars: Character[], i: number): [Octave | null, number] {
  const i0 = i
  const [o, i1] = eatChar(chars, i0, ['o'])
  const [octave, i2] = eatNaturalNumber(chars, i1)

  if (o === null) {
    return eatOctaveCommand(chars, i0)
  }

  const startLn = chars[i0].ln
  const startCn = chars[i0].cn

  if (octave === null) {
    throw new Error(
      `[ syntax error ] The octave number is not found: ${startLn} line, ${startCn} char.`
    )
  }
  if (startLn !== chars[i1].ln) {
    throw new Error(
      `[ syntax error ] The octave number is not found on the same line: ${startLn} line, ${startCn} char.`
    )
  }

  const envelope: Octave = {
    startLn: startLn,
    startCn: startCn,
    command: null,
    octave: octave,
  }
  return [envelope, i2]
}
