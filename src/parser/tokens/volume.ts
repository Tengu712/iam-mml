import {MAX_AMPLITUDE, MIN_AMPLITUDE} from '../../constants'
import type {Character} from '../lines'
import {eatChar, eatFloatingPointNumber} from './eat'

export type VolumeCommand = '+' | '-' | null

export type Volume = {
  startLn: number
  startCn: number
  command: VolumeCommand
  volume: number
}

/**
 * A function to eat a volume on the same line.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the eaten volume and the next index.
 * @throws an error when invalid volume command is found.
 */
export function eatVolume(chars: Character[], i: number): [Volume | null, number] {
  const i0 = i
  const [v, i1] = eatChar(chars, i, ['v'])
  const [command, i2] = eatChar(chars, i1, ['+', '-'])
  const [volume, i3] = eatFloatingPointNumber(chars, i2)

  if (v === null) {
    return [null, i]
  }

  const startLn = chars[i0].ln
  const startCn = chars[i0].cn

  if (volume === null) {
    throw new Error(
      `[ syntax error ] The volume number is not found: ${startLn} line, ${startCn} char.`
    )
  }
  if (startLn !== chars[i1].ln || startLn !== chars[i2].ln) {
    throw new Error(
      `[ syntax error ] The volume number is not found on the same line: ${startLn} line, ${startCn} char.`
    )
  }
  if (volume < MIN_AMPLITUDE || volume > MAX_AMPLITUDE) {
    throw new Error(
      `[ syntax error ] The volume number must be in [${MIN_AMPLITUDE}, ${MAX_AMPLITUDE}]: ${startLn} line, ${startCn} char.`
    )
  }

  const envelope: Volume = {
    startLn: startLn,
    startCn: startCn,
    command: command as VolumeCommand,
    volume: volume,
  }
  return [envelope, i3]
}
