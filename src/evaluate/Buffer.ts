import type {Pitch} from '../constants'
import type {Inst} from '../inst/Inst'

// TODO: document
export type Buffer = {
  seek: number
  size: number
  amplitude: number
  octave: number
  bpm: number
  noteValue: number
  shift: Map<Pitch, number>
  inst: Inst
  buffer: Float32Array | null
}
