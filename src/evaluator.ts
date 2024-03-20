import {evaluateNote} from './evaluator/note'
import type {Token} from './parser/tokens'

export const SAMPLE_RATE = 44100
export const PER_SAMPLE_RATE = 1 / SAMPLE_RATE

export type Buffer = {
  seek: number
  size: number
  amplitude: number
  octave: number
  bpm: number
  value: number
  buffer: Float32Array | null
}

function evaluateTokens(tokens: Token[], buffer: Buffer) {
  for (const token of tokens) {
    switch (token.id) {
      case 'Note':
        evaluateNote(token, buffer)
        break
    }
  }
}

function evaluatePart(tokens: Token[]): Float32Array {
  const preBuffer: Buffer = {
    seek: 0,
    size: 0,
    amplitude: 0.8,
    octave: 4,
    bpm: 120,
    value: 4,
    buffer: null,
  }
  evaluateTokens(tokens, preBuffer)
  const buffer: Buffer = {
    seek: 0,
    size: 0,
    amplitude: 0.8,
    octave: 4,
    bpm: 120,
    value: 4,
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
