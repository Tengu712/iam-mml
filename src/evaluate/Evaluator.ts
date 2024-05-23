import {createBuffer} from './Buffer'

import type {Commands} from '@/command/Commands'
import type {MacroDefs} from '@/parse/MacroDefs'
import type {InstDefs} from '@/parse/InstDefs'

export class Evaluator {
  private constructor() {}

  public static eval(commands: Commands, macroDefs: MacroDefs, instDefs: InstDefs): Float32Array {
    const preBuffer = createBuffer(null, macroDefs, instDefs)
    commands.eval(preBuffer)
    const buffer = createBuffer(new Float32Array(preBuffer.size), macroDefs, instDefs)
    commands.eval(buffer)
    return buffer.buffer!
  }
}
