import {MAX_BPM, MIN_BPM} from '../../constants'
import type {Character} from '../lines'
import {eatChar, eatFloatingPointNumber} from './eat'

export type TempoCommand = '+' | '-' | null

export type Tempo = {
  startLn: number
  startCn: number
  command: TempoCommand
  tempo: number
}

/**
 * A function to eat a tempo on the same line.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the eaten tempo and the next.
 * @throws an error when invalid tempo command found.
 */
export function eatTempo(chars: Character[], i: number): [Tempo | null, number] {
  const i0 = i
  const [v, i1] = eatChar(chars, i, ['t'])
  const [command, i2] = eatChar(chars, i1, ['+', '-'])
  const [tempo, i3] = eatFloatingPointNumber(chars, i2)

  if (v === null) {
    return [null, i]
  }

  const startLn = chars[i0].ln
  const startCn = chars[i0].cn

  if (tempo === null) {
    throw new Error(
      `[ syntax error ] The tempo number is not found: ${startLn} line, ${startCn} char.`
    )
  }
  if (startLn !== chars[i1].ln || startLn !== chars[i2].ln) {
    throw new Error(
      `[ syntax error ] The tempo number is not found on the same line: ${startLn} line, ${startCn} char.`
    )
  }
  if (command === null && (tempo < MIN_BPM || tempo > MAX_BPM)) {
    throw new Error(
      `[ syntax error ] The tempo number must be in [${MIN_BPM}, ${MAX_BPM}]: ${startLn} line, ${startCn} char.`
    )
  }

  const envelope: Tempo = {
    startLn: startLn,
    startCn: startCn,
    command: command as TempoCommand,
    tempo: tempo,
  }
  return [envelope, i3]
}
