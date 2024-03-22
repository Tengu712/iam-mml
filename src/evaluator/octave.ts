import type {Octave} from '../parser/tokens/octave'
import type {Buffer} from '../evaluator'

export function evaluateOctave(octave: Octave, buffer: Buffer) {
  buffer.octave = octave.octave
}
