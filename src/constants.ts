export const SAMPLE_RATE = 44100
export const PER_SAMPLE_RATE = 1 / SAMPLE_RATE

export const MIN_BPM = 1.0
export const MAX_BPM = 1000.0

export const MIN_AMPLITUDE = 0.0
export const MAX_AMPLITUDE = 1.0

export const MIN_OCTAVE = 1
export const MAX_OCTAVE = 8

export const PITCHES = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const
export const PITCHES_WITH_REST = [...PITCHES, 'r'] as const
export type Pitch = (typeof PITCHES)[number]
export type PitchWithRest = (typeof PITCHES_WITH_REST)[number]

export const ACCIDENTALS = ['+', '-', '='] as const
export type Accidental = (typeof ACCIDENTALS)[number]
