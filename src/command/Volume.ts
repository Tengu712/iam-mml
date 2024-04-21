import type {ICommand} from './ICommand'
import type {Buffer} from '../evaluate/Buffer'
import {Characters} from '../parse/Characters'
import {MAX_AMPLITUDE, MIN_AMPLITUDE} from '../constants'

export type VolumeCommand = '+' | '-' | null

export class Volume implements ICommand {
  private readonly command: VolumeCommand
  private readonly volume: number

  private constructor(command: VolumeCommand, volume: number) {
    this.command = command
    this.volume = volume
  }

  public static from(chars: Characters): Volume | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    // get ln and cn for me
    const ln = first.ln
    const cn = first.cn

    // 'v'
    const t = chars.eatChar(['v'])
    if (t === null) {
      return null
    }
    // (NNFloat)
    const volume = chars.eatNNFloat(ln)
    if (volume === null) {
      throw new Error(`[ syntax error ] The volume number is not found: ${ln} line, ${cn} char.`)
    }
    // ('+'|'-'|)
    const command = chars.eatChar(['+', '-'], ln)

    // check
    if (volume < MIN_AMPLITUDE || volume > MAX_AMPLITUDE) {
      throw new Error(
        `[ syntax error ] The volume number must be in [${MIN_AMPLITUDE}, ${MAX_AMPLITUDE}]: ${ln} line, ${cn} char.`
      )
    }

    return new Volume(command as VolumeCommand, volume)
  }

  public getCommand(): VolumeCommand | null {
    return this.command
  }
  public getVolume(): number {
    return this.volume
  }

  public eval(buffer: Buffer): void {
    switch (this.command) {
      case '+':
        buffer.amplitude = Math.max(
          Math.min(buffer.amplitude + this.volume, MAX_AMPLITUDE),
          MIN_AMPLITUDE
        )
        break
      case '-':
        buffer.amplitude = Math.max(
          Math.min(buffer.amplitude - this.volume, MAX_AMPLITUDE),
          MIN_AMPLITUDE
        )
        break
      case null:
        buffer.amplitude = Math.max(Math.min(this.volume, MAX_AMPLITUDE), MIN_AMPLITUDE)
        break
    }
  }
}
