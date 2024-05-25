import type {ICommand} from './ICommand'
import {ACCIDENTALS, PITCHES, type Accidental, type Pitch} from '../constants'
import type {Buffer} from '../evaluate/Buffer'
import {Characters} from '../parse/Characters'

export type KeyCommand = Accidental

export class Key implements ICommand {
  private readonly command: KeyCommand
  private readonly pitches: readonly Pitch[]

  private constructor(command: KeyCommand, pitches: readonly Pitch[]) {
    this.command = command
    this.pitches = pitches
  }

  public static from(chars: Characters): Key | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    // get ln and cn for me
    const ln = first.ln
    const cn = first.cn

    // 'k'
    const k = chars.eatChar(['k'])
    if (k === null) {
      return null
    }
    // (PITCH)+
    const pitches = []
    while (true) {
      const pitch = chars.eatChar(PITCHES, ln)
      if (pitch === null) {
        break
      }
      pitches.push(pitch)
    }
    // (ACCIDENTAL)
    const command = chars.eatChar(ACCIDENTALS, ln)
    if (command === null) {
      throw new Error(
        `[syntax error] The key command must have an accidental: ${ln} line, ${cn} char.`
      )
    }

    return new Key(command as KeyCommand, pitches as readonly Pitch[])
  }

  public getCommand(): KeyCommand {
    return this.command
  }
  public getPitches(): readonly Pitch[] {
    return this.pitches
  }

  public eval(buffer: Buffer): void {
    const shift = this.command === '+' ? 1 : this.command === '-' ? -1 : 0
    const arr = this.pitches.length === 0 ? PITCHES : this.pitches
    for (const n of arr) {
      buffer.shift.set(n, shift)
    }
  }
}
