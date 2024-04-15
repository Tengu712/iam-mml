import type {Octave} from '../parser/tokens/octave'
import type {Buffer} from '../evaluator'

const MIN_OCTAVE = 1
const MAX_OCTAVE = 8

export function evaluateOctave(octave: Octave, buffer: Buffer) {
  if (octave.command === '<') {
    buffer.octave = Math.max(Math.min(buffer.octave - 1, MAX_OCTAVE), MIN_OCTAVE)
  } else if (octave.command === '>') {
    buffer.octave = Math.max(Math.min(buffer.octave + 1, MAX_OCTAVE), MIN_OCTAVE)
  } else {
    buffer.octave = Math.max(Math.min(octave.octave, MAX_OCTAVE), MIN_OCTAVE)
  }
}
