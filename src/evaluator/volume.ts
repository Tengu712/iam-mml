import {MAX_AMPLITUDE, MIN_AMPLITUDE} from '../constants'
import type {Volume} from '../parser/tokens/volume'
import type {Buffer} from '../evaluator'

export function evaluateVolume(volume: Volume, buffer: Buffer) {
  if (volume.command === '+') {
    buffer.amplitude = Math.max(
      Math.min(buffer.amplitude + volume.volume, MAX_AMPLITUDE),
      MIN_AMPLITUDE
    )
  } else if (volume.command === '-') {
    buffer.amplitude = Math.max(
      Math.min(buffer.amplitude - volume.volume, MAX_AMPLITUDE),
      MIN_AMPLITUDE
    )
  } else {
    buffer.amplitude = Math.max(Math.min(volume.volume, MAX_AMPLITUDE), MIN_AMPLITUDE)
  }
}
