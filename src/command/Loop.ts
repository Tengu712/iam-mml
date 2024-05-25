import type {ICommand} from './ICommand'
import {Commands} from './Commands'

import type {Buffer} from '@/evaluate/Buffer'
import type {Characters} from '@/parse/Characters'

export class Loop implements ICommand {
  private readonly count: number
  private readonly former: Commands
  private readonly latter: Commands | null
  private readonly isDelimited: boolean

  private constructor(
    count: number,
    former: Commands,
    latter: Commands | null,
    isDelimited: boolean
  ) {
    this.count = count
    this.former = former
    this.latter = latter
    this.isDelimited = isDelimited
  }

  public static from(chars: Characters): Loop | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    // get ln and cn for me
    const ln = first.ln
    const cn = first.cn

    // "["
    const open = chars.eatChar(['['])
    if (open === null) {
      return null
    }
    // commands
    const former = new Commands(chars, true)
    if (former.isEmpty()) {
      throw new Error(
        `[syntax error] The loop command must contain at least one command: ${ln} line, ${cn} char.`
      )
    }
    // [ ":"
    const colonChar = chars.get()
    const colon = chars.eatChar([':'])
    const isDelimited = colon !== null
    // commands ]
    const latter = isDelimited ? new Commands(chars, true) : null
    if (latter !== null && latter.isEmpty()) {
      throw new Error(
        `[syntax error] No command is found after ':': ${colonChar!.ln} line, ${colonChar!.cn} char.`
      )
    }
    // ']'
    const closeChar = chars.get()
    const close = chars.eatChar([']'])
    if (closeChar === null || close === null) {
      throw new Error(`[syntax error] The loop command is not closed: ${ln} line, ${cn} char.`)
    }
    // natural-number
    const count = chars.eatNatural(closeChar.ln)
    if (count === null) {
      throw new Error(
        `[syntax error] The number of loop iterations is not specified after the ']': ${closeChar.ln} line, ${closeChar.cn} char.`
      )
    }

    return new Loop(count, former, latter, isDelimited)
  }

  public getCount(): number {
    return this.count
  }

  public getFormer(): Commands {
    return this.former
  }

  public getLatter(): Commands | null {
    return this.latter
  }

  public getIsDelimited(): boolean {
    return this.isDelimited
  }

  public eval(buffer: Buffer): void {
    for (let i = 0; i < this.count; ++i) {
      this.former.eval(buffer)
      if (this.isDelimited && i === this.count - 1) {
        break
      }
      this.latter?.eval(buffer)
    }
  }
}
