import type {ICommand} from './ICommand'
import {Commands} from './Commands'

import type {Buffer} from '@/evaluate/Buffer'
import type {Characters} from '@/parse/Characters'

export class Loop implements ICommand {
  private readonly count: number
  private readonly commands: Commands

  private constructor(count: number, commands: Commands) {
    this.count = count
    this.commands = commands
  }

  public static from(chars: Characters): Loop | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    // get ln and cn for me
    const ln = first.ln
    const cn = first.cn

    // '['
    const open = chars.eatChar(['['])
    if (open === null) {
      return null
    }
    // (COMMANDS)
    const commands = new Commands(chars, true)
    if (commands.isEmpty()) {
      throw new Error(
        `[syntax error] The loop command must contain at least one command: ${ln} line, ${cn} char.`
      )
    }
    // ']'
    const closeChar = chars.get()
    const close = chars.eatChar([']'])
    if (closeChar === null || close === null) {
      throw new Error(`[syntax error] The loop command is not closed: ${ln} line, ${cn} char.`)
    }
    // (NATURAL)
    const count = chars.eatNatural(closeChar.ln)
    if (count === null) {
      throw new Error(
        `[syntax error] The number of loop iterations is not specified after the ']': ${closeChar.ln} line, ${closeChar.cn} char.`
      )
    }

    return new Loop(count, commands)
  }

  public getCount(): number {
    return this.count
  }

  public getCommands(): Commands {
    return this.commands
  }

  public eval(buffer: Buffer): void {
    for (let i = 0; i < this.count; ++i) {
      this.commands.eval(buffer)
    }
  }
}
