import type {Character} from '../lines'
import {eatChar, eatNaturalNumber} from './eat'

export type Scale = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'r'
export type Accidental = '+' | '-' | '='

export type Note = {
  startLn: number
  startCn: number
  scale: Scale
  accidental: Accidental | null
  noteValue: number | null
  dotted: boolean
}

/**
 * A function to eat a note on the same line.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the eaten note and the next index.
 */
export function eatNote(chars: Character[], i: number): [Note | null, number] {
  // check if it's out of range
  if (i >= chars.length) {
    return [null, i]
  }
  // check if the first character is a scale
  switch (chars[i].c) {
    case 'a':
    case 'b':
    case 'c':
    case 'd':
    case 'e':
    case 'f':
    case 'g':
    case 'r':
      break
    default:
      return [null, i]
  }

  // get startLn and startCn
  const startLn = chars[i].ln
  const startCn = chars[i].cn

  // create wrapper closures
  const eatCharWrapper = (
    idx: number,
    matches: string[]
  ): [string | null, number] => {
    if (idx >= chars.length || chars[idx].ln !== startLn) {
      return [null, idx]
    } else {
      return eatChar(chars, idx, matches)
    }
  }
  const eatIntegerWrapper = (idx: number): [number | null, number] => {
    if (idx >= chars.length || chars[idx].ln !== startLn) {
      return [null, idx]
    } else {
      return eatNaturalNumber(chars, idx)
    }
  }

  // parse
  const i0 = i
  const [scale, i1] = [chars[i0].c, i0 + 1]
  const [accidental, i2] = eatCharWrapper(i1, ['+', '-', '='])
  const [noteValue, i3] = eatIntegerWrapper(i2)
  const [dot, i4] = eatCharWrapper(i3, ['.'])
  if (noteValue === 0) {
    throw new Error(
      `[ syntax error ] Note value must be greater than 0.: ${startLn} line, ${startCn} char.`
    )
  }
  const note = {
    startLn: startLn,
    startCn: startCn,
    scale: scale as Scale,
    accidental: accidental as Accidental,
    noteValue: noteValue,
    dotted: dot !== null,
  }
  return [note, i4]
}
