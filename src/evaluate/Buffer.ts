import type {Pitch} from '../constants'

// TODO: document
export type Buffer = {
  seek: number
  size: number
  amplitude: number
  octave: number
  bpm: number
  noteValue: number
  shift: Map<Pitch, number>
  buffer: Float32Array | null
}
