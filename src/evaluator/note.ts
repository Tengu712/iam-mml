import {SAMPLE_RATE, type Buffer, PER_SAMPLE_RATE} from '../evaluator'
import type {Note, Scale} from '../parser/tokens/note'

const SEMITONE_STEP = 2 ** (1 / 12)
const FADE_INTERVAL = 150

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

function sin(t: number, frequency: number): number {
  return Math.sin(2 * Math.PI * frequency * t)
}

function triangle(t: number, frequency: number): number {
  return (2 / Math.PI) * Math.acos(Math.cos(2 * Math.PI * frequency * t)) - 1
}

function square(t: number, frequency: number): number {
  const T = 1 / frequency
  if (t % T < T / 2) {
    return 1
  } else {
    return -1
  }
}

function sawtooth(t: number, frequency: number): number {
  return 2 * (t * frequency - Math.floor(t * frequency + 1 / 2))
}

export function evaluateNote(note: Note, buffer: Buffer) {
  const current = buffer.seek

  const spb = 60 / buffer.bpm
  const v = 4 / (note.noteValue ?? buffer.noteValue)
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

  const frequency = getFrequency(note, buffer) * PER_SAMPLE_RATE
  // TODO: modulate
  for (let i = current; i < current + length; ++i) {
    const t = i - current
    // buffer.buffer[i] = buffer.amplitude * sin(t, frequency)
    buffer.buffer[i] = buffer.amplitude * triangle(t, frequency)
    // buffer.buffer[i] = buffer.amplitude * square(t, frequency)
    // buffer.buffer[i] = buffer.amplitude * sawtooth(t, frequency)
  }
  for (let i = current; i < current + FADE_INTERVAL; ++i) {
    const t = i - current
    buffer.buffer[i] *= t / FADE_INTERVAL
  }
  for (let i = current + length - FADE_INTERVAL; i < current + length; ++i) {
    const t = i - (current + length - FADE_INTERVAL)
    buffer.buffer[i] *= (FADE_INTERVAL - t) / FADE_INTERVAL
  }
}
