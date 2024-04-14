import type {Volume} from '../parser/tokens/volume'
import type {Buffer} from '../evaluator'

export function evaluateVolume(volume: Volume, buffer: Buffer) {
  if (volume.command === '+') {
    buffer.amplitude = Math.max(Math.min(buffer.amplitude + volume.volume, 1.0), 0.0)
  } else if (volume.command === '-') {
    buffer.amplitude = Math.max(Math.min(buffer.amplitude - volume.volume, 1.0), 0.0)
  } else {
    buffer.amplitude = Math.max(Math.min(volume.volume, 1.0), 0.0)
  }
}
