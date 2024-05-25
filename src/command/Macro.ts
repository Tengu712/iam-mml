import type {ICommand} from './ICommand'

import type {Buffer} from '@/evaluate/Buffer'
import type {Characters} from '@/parse/Characters'

export class Macro implements ICommand {
  private readonly ln: number
  private readonly cn: number
  private readonly name: string

  private constructor(ln: number, cn: number, name: string) {
    this.ln = ln
    this.cn = cn
    this.name = name
  }

  public static from(chars: Characters): Macro | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    // get ln and cn for me
    const ln = first.ln
    const cn = first.cn

    // 'l'
    const x = chars.eatChar(['!'])
    if (x === null) {
      return null
    }
    // (IDENTIFER)
    const name = chars.eatIdentifier(ln)
    if (name === null) {
      throw new Error(`[syntax error] The macro name is not found: ${ln} line, ${cn} char.`)
    }

    return new Macro(ln, cn, name)
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
    const commandsOnDemand = buffer.macroDefs.get(this.name)
    if (commandsOnDemand === null) {
      throw new Error(`[syntax error] The macro is not defined: ${this.ln} line, ${this.cn} char.`)
    }
    commandsOnDemand.get().eval(buffer)
  }
}
