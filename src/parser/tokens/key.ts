import {ACCIDENTALS, PITCHES, type Accidental, type Pitch} from '../../constants'
import type {Character} from '../lines'
import {eatChar} from './eat'

export type KeyCommand = Accidental
export type Key = {
  readonly startLn: number
  readonly startCn: number
  readonly command: KeyCommand
  readonly pitches: readonly Pitch[]
}

/**
 * A function to eat a key on the same line.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the eaten key and the next index.
 * @throws an error when invalid key command is found.
 */
export function eatKey(chars: readonly Character[], i: number): [Key | null, number] {
  const i0 = i

  // 'k'
  const [k, i1] = eatChar(chars, i, ['k'])
  if (k === null) {
    return [null, i0]
  }

  // get startLn and startCn for me
  const startLn = chars[i0].ln
  const startCn = chars[i0].cn

  // (PITCH)+
  let curi = i1
  const pitches = []
  while (true) {
    const previ = curi
    const [pitch, newi] = eatChar(chars, previ, PITCHES)
    if (pitch === null) {
      break
    }
    if (startLn !== chars[previ].ln) {
      throw new Error(
        `[ syntax error ] The key command was in the middle: ${startLn} line, ${startCn} char.`
      )
    }
    pitches.push(pitch as Pitch)
    curi = newi
  }
  const i2 = curi

  // ('+'|'-'|'=')
  const [command, i3] = eatChar(chars, i2, ACCIDENTALS)
  if (command === null || startLn !== chars[i2].ln) {
    throw new Error(
      `[ syntax error ] The key command must have '+' or '-' or '=': ${startLn} line, ${startCn} char.`
    )
  }

  // finish
  const envelope: Key = {
    startLn: startLn,
    startCn: startCn,
    command: command as KeyCommand,
    pitches: pitches as readonly Pitch[],
  }
  return [envelope, i3]
}
