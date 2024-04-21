import type {ICommand} from './ICommand'
import type {Buffer} from '../evaluate/Buffer'
import {Characters} from '../parse/Characters'
import {MAX_BPM, MIN_BPM} from '../constants'

export type TempoCommand = '+' | '-' | null

export class Tempo implements ICommand {
  private readonly command: TempoCommand
  private readonly tempo: number

  private constructor(command: TempoCommand, tempo: number) {
    this.command = command
    this.tempo = tempo
  }

  public static from(chars: Characters): Tempo | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    // get ln and cn for me
    const ln = first.ln
    const cn = first.cn

    // 't'
    const t = chars.eatChar(['t'])
    if (t === null) {
      return null
    }
    // (NNFloat)
    const tempo = chars.eatNNFloat(ln)
    if (tempo === null) {
      throw new Error(`[ syntax error ] The tempo number is not found: ${ln} line, ${cn} char.`)
    }
    // ('+'|'-'|)
    const command = chars.eatChar(['+', '-'], ln)

    // check
    if (command === null && (tempo < MIN_BPM || tempo > MAX_BPM)) {
      throw new Error(
        `[ syntax error ] The tempo number must be in [${MIN_BPM}, ${MAX_BPM}]: ${ln} line, ${cn} char.`
      )
    }

    return new Tempo(command as TempoCommand, tempo)
  }

  public getCommand(): TempoCommand | null {
    return this.command
  }
  public getTempo(): number {
    return this.tempo
  }

  public eval(buffer: Buffer): void {
    switch (this.command) {
      case '+':
        buffer.bpm = Math.max(Math.min(buffer.bpm + this.tempo, MAX_BPM), MIN_BPM)
        break
      case '-':
        buffer.bpm = Math.max(Math.min(buffer.bpm - this.tempo, MAX_BPM), MIN_BPM)
        break
      case null:
        buffer.bpm = Math.max(Math.min(this.tempo, MAX_BPM), MIN_BPM)
        break
    }
  }
}
