import {SAMPLE_RATE, type Buffer, PER_SAMPLE_RATE} from '../evaluator'
import type {Note, Scale} from '../parser/tokens/note'

const SEMITONE_STEP = 2 ** (1 / 12)

function convertScaleToNumber(scale: Scale): number {
  switch (scale) {
    case 'c':
      return 0
    case 'd':
      return 2
    case 'e':
      return 4
    case 'f':
      return 5
    case 'g':
      return 7
    case 'a':
      return 9
    case 'b':
      return 11
    default:
      throw new Error(
        `[ unexpected error ] Tried to convert '${scale}' to number.`
      )
  }
}

function getFrequency(note: Note, buffer: Buffer): number {
  let n = convertScaleToNumber(note.scale) + 12 * buffer.octave
  // TODO: key signature
  if (note.accidental === '+') {
    n += 1
  }
  if (note.accidental === '-') {
    n -= 1
  }
  // TODO: natural
  const d = n - 57
  return 440 * SEMITONE_STEP ** d
}

export function evaluateNote(note: Note, buffer: Buffer) {
  const current = buffer.seek

  const value = note.noteValue ?? buffer.value
  const spb = 60 / buffer.bpm
  const v = 4 / value
  const d = note.dotted ? 1.5 : 1
  const length = SAMPLE_RATE * spb * v * d
  buffer.seek += length
  // TODO: adsr
  buffer.size += length

  if (buffer.buffer === null) {
    return
  }

  if (note.scale === 'r') {
    return
  }

  const frequency = getFrequency(note, buffer)
  // TODO: modulate
  for (let i = current; i < current + length; ++i) {
    buffer.buffer[i] =
      buffer.amplitude * Math.sin(2 * Math.PI * frequency * PER_SAMPLE_RATE * i)
  }
}
