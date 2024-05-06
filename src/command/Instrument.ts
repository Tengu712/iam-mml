import type {ICommand} from './ICommand'
import type {Buffer} from '../evaluate/Buffer'
import {Characters} from '../parse/Characters'
import {Inst} from '../inst/Inst'
import type {Insts} from '../inst/Insts'

export class Instrument implements ICommand {
  private readonly inst: Inst

  private constructor(inst: Inst) {
    this.inst = inst
  }

  public static from(chars: Characters, insts: Insts): Instrument | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    // get ln and cn for me
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

    // check
    const inst = insts.get('@' + name)
    if (inst === null) {
      throw new Error(
        `[syntax error] The instrument "@${name}" is undefined: ${ln} line, ${cn} char.`
      )
    }

    return new Instrument(inst)
  }

  public getInst(): Inst {
    return this.inst
  }

  public eval(buffer: Buffer): void {
    buffer.inst = this.inst
  }
}
