import type {ICommand} from './ICommand'
import type {Buffer} from '../evaluate/Buffer'
import {Characters} from '../parse/Characters'

export class Length implements ICommand {
  private readonly noteValue: number

  private constructor(noteValue: number) {
    this.noteValue = noteValue
  }

  public static from(chars: Characters): Length | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    // get ln and cn for me
    const ln = first.ln
    const cn = first.cn

    // 'l'
    const k = chars.eatChar(['l'])
    if (k === null) {
      return null
    }
    // (NATURAL)
    const noteValue = chars.eatNatural(ln)
    if (noteValue === null) {
      throw new Error(`[ syntax error ] The note value is not found: ${ln} line, ${cn} char.`)
    }

    // check
    if (noteValue <= 0) {
      throw new Error(
        `[ syntax error ] The note value must be greater than 0: ${ln} line, ${cn} char.`
      )
    }

    return new Length(noteValue)
  }

  public getNoteValue(): number {
    return this.noteValue
  }

  public eval(buffer: Buffer): void {
    buffer.noteValue = this.noteValue
  }
}
