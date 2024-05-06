import type {Buffer} from './Buffer'
import type {ICommand} from '../command/ICommand'
import {Inst} from '../inst/Inst'
import {Lines} from '../inst/Lines'

export class Evaluator {
  private constructor() {}

  public static eval(commands: readonly ICommand[]): Float32Array {
    const inst = new Inst(new Lines('@\n1 1 0 0 1 0'))
    const preBuffer: Buffer = {
      seek: 0,
      size: 0,
      amplitude: 0.5,
      octave: 4,
      bpm: 120,
      noteValue: 4,
      shift: new Map(),
      inst: inst,
      buffer: null,
    }
    for (const command of commands) {
      command.eval(preBuffer)
    }
    const buffer: Buffer = {
      seek: 0,
      size: 0,
      amplitude: 0.5,
      octave: 4,
      bpm: 120,
      noteValue: 4,
      shift: new Map(),
      inst: inst,
      buffer: new Float32Array(preBuffer.size),
    }
    for (const command of commands) {
      command.eval(buffer)
    }
    return buffer.buffer!
  }
}
