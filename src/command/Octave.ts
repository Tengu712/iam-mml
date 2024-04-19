import type {ICommand} from './ICommand'
import type {Buffer} from '../evaluate/Buffer'
import {Eat} from '../parse/Eat'
import {Characters} from '../parse/Characters'
import {MAX_OCTAVE, MIN_OCTAVE} from '../constants'

export type OctaveCommand = '<' | '>' | null

export class Octave implements ICommand {
  private readonly command: OctaveCommand
  private readonly octave: number

  private constructor(command: OctaveCommand, octave: number) {
    this.command = command
    this.octave = octave
  }

  public static from(chars: Characters): Octave | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    // get ln and cn for me
    const ln = first.ln
    const cn = first.cn

    // '<'|'>'
    const command = Eat.char(chars, ['<', '>'])
    if (command !== null) {
      return new Octave(command as OctaveCommand, 0)
    }

    // 'o'
    const o = Eat.char(chars, ['o'])
    if (o === null) {
      return null
    }
    // (NATURAL)
    const octave = Eat.natural(chars, ln)
    if (octave === null) {
      throw new Error(`[ syntax error ] The octave number is not found: ${ln} line, ${cn} char.`)
    }

    return new Octave(null, octave)
  }

  public getCommand(): OctaveCommand | null {
    return this.command
  }
  public getOctave(): number {
    return this.octave
  }

  public eval(buffer: Buffer): void {
    switch (this.command) {
      case '<':
        buffer.octave = Math.max(Math.min(buffer.octave - 1, MAX_OCTAVE), MIN_OCTAVE)
        break
      case '>':
        buffer.octave = Math.max(Math.min(buffer.octave + 1, MAX_OCTAVE), MIN_OCTAVE)
        break
      case null:
        buffer.octave = Math.max(Math.min(this.octave, MAX_OCTAVE), MIN_OCTAVE)
        break
    }
  }
}
