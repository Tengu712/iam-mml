import {SAMPLE_RATE, type Buffer, PER_SAMPLE_RATE} from '../evaluator'
import type {Token} from '../parser/tokens'
import type {Note} from '../parser/tokens/note'

function getFrequency(note: Note, buffer: Buffer): number {
  // TODO:
  return 440
}

export function evaluateNote(token: Token, buffer: Buffer) {
  const note = token.value as Note
  const current = buffer.seek

  const value = note.noteValue ?? buffer.value
  const length = (((SAMPLE_RATE * 4) / value) * 60) / buffer.bpm
  buffer.seek += length
  // TODO: adsr
  buffer.size += length

  if (buffer.buffer === null) {
    return
  }

  const frequency = getFrequency(note, buffer)
  // TODO: modulate
  for (let i = current; i < current + length; ++i) {
    buffer.buffer[i] =
      buffer.amplitude * Math.sin(2 * Math.PI * frequency * PER_SAMPLE_RATE * i)
  }
}
