import {evaluateLength} from './evaluator/length'
import {evaluateNote} from './evaluator/note'
import {evaluateOctave} from './evaluator/octave'
import {evaluateVolume} from './evaluator/volume'
import type {Token} from './parser/tokens'
import type {Length} from './parser/tokens/length'
import type {Note} from './parser/tokens/note'
import type {Octave} from './parser/tokens/octave'
import type {Volume} from './parser/tokens/volume'

export const SAMPLE_RATE = 44100
export const PER_SAMPLE_RATE = 1 / SAMPLE_RATE

export type Buffer = {
  seek: number
  size: number
  amplitude: number
  octave: number
  bpm: number
  noteValue: number
  buffer: Float32Array | null
}

function evaluateTokens(tokens: Token[], buffer: Buffer) {
  for (const token of tokens) {
    switch (token.id) {
      case 'Note':
        evaluateNote(token.payload as Note, buffer)
        break
      case 'Length':
        evaluateLength(token.payload as Length, buffer)
        break
      case 'Octave':
        evaluateOctave(token.payload as Octave, buffer)
        break
      case 'Volume':
        evaluateVolume(token.payload as Volume, buffer)
        break
    }
  }
}

function evaluatePart(tokens: Token[]): Float32Array {
  const preBuffer: Buffer = {
    seek: 0,
    size: 0,
    amplitude: 0.5,
    octave: 4,
    bpm: 120,
    noteValue: 4,
    buffer: null,
  }
  evaluateTokens(tokens, preBuffer)
  const buffer: Buffer = {
    seek: 0,
    size: 0,
    amplitude: 0.5,
    octave: 4,
    bpm: 120,
    noteValue: 4,
    buffer: new Float32Array(preBuffer.size),
  }
  evaluateTokens(tokens, buffer)
  return buffer.buffer!
}

export function evaluate(tokensPerPart: Map<string, Token[]>): Float32Array[] {
  const waves = []
  for (const [_, tokens] of tokensPerPart) {
    waves.push(evaluatePart(tokens))
  }
  return waves
}
