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
 * @returns the eaten octave and the next index.
 * @throws an error when the octave number is not found.
 */
export function eatVolume(
  chars: Character[],
  i: number
): [Volume | null, number] {
  if (i >= chars.length || chars[i].c !== 'v') {
    return [null, i]
  }
  const startLn = chars[i].ln
  const startCn = chars[i].cn
  const [v, i1] = eatChar(chars, i, ['v'])
  const [command, i2] = eatChar(chars, i1, ['+', '-'])
  const [volume, i3] = eatFloatingPointNumber(chars, i2)
  if (
    v === null ||
    volume === null ||
    startLn !== chars[i1].ln ||
    startLn !== chars[i2].ln
  ) {
    throw new Error(
      `[ syntax error ] Invalid volume command is found: ${startLn} line, ${startCn} char.`
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
