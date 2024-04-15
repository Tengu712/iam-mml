import {MAX_BPM, MIN_BPM} from '../constants'
import type {Tempo} from '../parser/tokens/tempo'
import type {Buffer} from '../evaluator'

export function evaluateTempo(tempo: Tempo, buffer: Buffer) {
  if (tempo.command === '+') {
    buffer.bpm = Math.max(Math.min(buffer.amplitude + tempo.tempo, MAX_BPM), MIN_BPM)
  } else if (tempo.command === '-') {
    buffer.bpm = Math.max(Math.min(buffer.amplitude - tempo.tempo, MAX_BPM), MIN_BPM)
  } else {
    buffer.bpm = Math.max(Math.min(tempo.tempo, MAX_BPM), MIN_BPM)
  }
}
