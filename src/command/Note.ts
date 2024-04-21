import type {ICommand} from './ICommand'
import {
  ACCIDENTALS,
  PER_SAMPLE_RATE,
  PITCHES_WITH_REST,
  SAMPLE_RATE,
  type Accidental,
  type Pitch,
  type PitchWithRest,
} from '../constants'
import type {Buffer} from '../evaluate/Buffer'
import {Characters} from '../parse/Characters'

const SEMITONE_STEP = 2 ** (1 / 12)

function convertScaleToNumber(pitch: Pitch): number {
  switch (pitch) {
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
  }
}

function getFrequency(pitch: Pitch, accidental: Accidental | null, buffer: Buffer): number {
  let n = convertScaleToNumber(pitch) + 12 * buffer.octave
  switch (accidental) {
    case '+':
      n += 1
      break
    case '-':
      n -= 1
      break
    case '=':
      break
    case null:
      n += buffer.shift.get(pitch) ?? 0
      break
  }
  const d = n - 57
  return 440 * SEMITONE_STEP ** d
}

// TODO: move into tone generator
function triangle(t: number, frequency: number): number {
  return (2 / Math.PI) * Math.acos(Math.cos(2 * Math.PI * frequency * t)) - 1
}

export class Note implements ICommand {
  private readonly pitch: PitchWithRest
  private readonly accidental: Accidental | null
  private readonly noteValue: number | null
  private readonly dotted: boolean

  private constructor(
    pitch: PitchWithRest,
    accidental: Accidental | null,
    noteValue: number | null,
    dotted: boolean
  ) {
    this.pitch = pitch
    this.accidental = accidental
    this.noteValue = noteValue
    this.dotted = dotted
  }

  public static from(chars: Characters): Note | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    // get ln and cn for me
    const ln = first.ln
    const cn = first.cn

    // (PITCH_WITH_REST)
    const pitch = chars.eatChar(PITCHES_WITH_REST)
    if (pitch === null) {
      return null
    }
    // (ACCIDENTAL)
    const accidental = chars.eatChar(ACCIDENTALS, ln)
    // (NATURAL)
    const noteValue = chars.eatNatural(ln)
    // ('.'|)
    const dot = chars.eatChar(['.'], ln)
    const dotted = dot !== null

    // check
    if (noteValue !== null && noteValue <= 0) {
      throw new Error(`[ syntax error ] Note value must be greater than 0: ${ln} line, ${cn} char.`)
    }

    return new Note(pitch as PitchWithRest, accidental as Accidental, noteValue, dotted)
  }

  public getPitch(): PitchWithRest {
    return this.pitch
  }
  public getAccidental(): Accidental | null {
    return this.accidental
  }
  public getNoteValue(): number | null {
    return this.noteValue
  }
  public isDotted(): boolean {
    return this.dotted
  }

  public eval(buffer: Buffer): void {
    const current = buffer.seek

    const spb = 60 / buffer.bpm
    const v = 4 / (this.noteValue ?? buffer.noteValue)
    const d = this.dotted ? 1.5 : 1
    const length = Math.ceil(SAMPLE_RATE * spb * v * d)
    buffer.seek += length
    // TODO: adsr
    buffer.size += length

    if (buffer.buffer === null) {
      return
    }

    if (this.pitch === 'r') {
      return
    }

    const frequency = getFrequency(this.pitch, this.accidental, buffer) * PER_SAMPLE_RATE
    // TODO: modulate
    for (let i = current; i < current + length; ++i) {
      const t = i - current
      buffer.buffer[i] += buffer.amplitude * triangle(t, frequency)
    }
  }
}
