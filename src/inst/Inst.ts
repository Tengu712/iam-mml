import {Lines} from './Lines'
import {Operators} from './Operators'

export class Inst {
  private readonly name: string
  private readonly carrier: Operators
  private readonly release: number

  public constructor(lines: Lines) {
    const name = lines.get()
    if (name === null) {
      throw new Error(`[unexpected error] Tried to read an inexistent instrument.`)
    }
    if (!name.body.startsWith('@')) {
      throw new Error(
        `[syntax error] The instrument name must be started with '@': ${name.ln} line.`
      )
    }
    this.name = name.body
    lines.forward()
    this.carrier = new Operators(lines, 0)
    this.release = this.carrier.getRelease()
  }

  public getName(): string {
    return this.name
  }

  public getRelease(): number {
    return this.release
  }

  public run(f: number, g: number, t: number): number {
    return this.carrier.run(f, g, t)
  }
}
