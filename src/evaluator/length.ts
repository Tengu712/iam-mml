import type {Length} from '../parser/tokens/length'
import type {Buffer} from '../evaluator'

export function evaluateLength(length: Length, buffer: Buffer) {
  buffer.noteValue = length.noteValue
}
