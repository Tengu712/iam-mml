import type {Buffer} from './Buffer'
import type {ICommand} from '../command/ICommand'

export class Evaluator {
  private constructor() {}

  public static eval(commands: readonly ICommand[]): Float32Array {
    const preBuffer: Buffer = {
      seek: 0,
      size: 0,
      amplitude: 0.5,
      octave: 4,
      bpm: 120,
      noteValue: 4,
      shift: new Map(),
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
      buffer: new Float32Array(preBuffer.size),
    }
    for (const command of commands) {
      command.eval(buffer)
    }
    return buffer.buffer!
  }
}
