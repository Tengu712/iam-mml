import type {Pitch} from '@/constants'
import type {MacroDefs} from '@/parse/MacroDefs'
import type {InstDefs} from '@/parse/InstDefs'
import {Inst} from '@/inst/Inst'
import {Characters} from '@/parse/Characters'
import {convertStringToCharacters} from '@/parse/Character'

// TODO: document
export type Buffer = {
  // output source
  seek: number
  size: number
  buffer: Float32Array | null

  //
  amplitude: number
  octave: number
  bpm: number
  noteValue: number
  shift: Map<Pitch, number>
  inst: Inst

  // other definitions
  macroDefs: MacroDefs
  instDefs: InstDefs
}

export function createBuffer(
  buffer: Float32Array | null,
  macroDefs: MacroDefs,
  instDefs: InstDefs
): Buffer {
  return {
    // output source
    seek: 0,
    size: 0,
    buffer: buffer,
    //
    amplitude: 0.5,
    octave: 4,
    bpm: 120,
    noteValue: 4,
    shift: new Map(),
    inst: new Inst(new Characters(convertStringToCharacters('1 1 0 0 1 0', 0, 0))),
    // other definitions
    macroDefs: macroDefs,
    instDefs: instDefs,
  }
}
