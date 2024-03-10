import type {Character} from '../lines'
import {eatChar, eatInteger} from './eat'

export type Note = {
  startLn: number
  startCn: number
  scale: string
  accidental: string | null
  noteValue: number | null
  dotted: boolean
}

/**
 * A function to eat a note.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the eaten note and the next index.
 */
export function eatNote(chars: Character[], i: number): [Note | null, number] {
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
  const i0 = i
  const [scale, i1] = [chars[i0].c, i0 + 1]
  const [accidental, i2] = eatChar(chars, i1, ['+', '-', '='])
  const [noteValue, i3] = eatInteger(chars, i2)
  const [dot, i4] = eatChar(chars, i3, ['.'])
  const note = {
    startLn: chars[i0].ln,
    startCn: chars[i0].cn,
    scale: scale,
    accidental: accidental,
    noteValue: noteValue,
    dotted: dot !== null,
  }
  return [note, i4]
}
