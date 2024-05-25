import type {ICommand} from './ICommand'

import type {Buffer} from '@/evaluate/Buffer'
import type {Characters} from '@/parse/Characters'

export class Instrument implements ICommand {
  private readonly ln: number
  private readonly cn: number
  private readonly name: string

  private constructor(ln: number, cn: number, name: string) {
    this.ln = ln
    this.cn = cn
    this.name = name
  }

  public static from(chars: Characters): Instrument | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    const ln = first.ln
    const cn = first.cn

    // '@'
    const a = chars.eatChar(['@'])
    if (a === null) {
      return null
    }
    // (IDENTIFIER)
    const name = chars.eatIdentifier(ln)
    if (name === null) {
      throw new Error(`[syntax error] The instrument id is not found: ${ln} line, ${cn} char.`)
    }

    return new Instrument(ln, cn, '@' + name)
  }

  public getLn(): number {
    return this.ln
  }

  public getCn(): number {
    return this.cn
  }

  public getName(): string {
    return this.name
  }

  public eval(buffer: Buffer): void {
    const instOnDemand = buffer.instDefs.get(this.name)
    if (instOnDemand === null) {
      throw new Error(
        `[syntax error] The instrument "@${this.name}" is undefined: ${this.ln} line, ${this.cn} char.`
      )
    }
    buffer.inst = instOnDemand.get()
  }
}
