import {Inst} from './Inst'
import {Lines} from './Lines'

export class Insts {
  private readonly insts: Map<string, Inst>

  public constructor(text: string) {
    this.insts = new Map()
    const lines = new Lines(text)
    while (true) {
      const line = lines.get()
      if (line === null) {
        break
      }
      const inst = new Inst(lines)
      const name = inst.getName()
      if (this.insts.has(name)) {
        throw new Error(
          `[syntax error] The instrument "${name}" is already defined: ${line.ln} line.`
        )
      }
      this.insts.set(name, inst)
    }
  }

  public get(name: string): Inst | null {
    if (this.insts.has(name)) {
      return this.insts.get(name)!
    } else {
      return null
    }
  }
}
