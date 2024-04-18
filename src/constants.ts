export const MIN_BPM = 1.0
export const MAX_BPM = 1000.0

export const MIN_AMPLITUDE = 0.0
export const MAX_AMPLITUDE = 1.0

export const PITCHES = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const
export type Pitch = (typeof PITCHES)[number]

export const ACCIDENTALS = ['+', '-', '='] as const
export type Accidental = (typeof ACCIDENTALS)[number]
