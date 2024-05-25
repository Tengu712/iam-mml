import type {ICommand} from './ICommand'
import {Key} from './Key'
import {Length} from './Length'
import {Note} from './Note'
import {Octave} from './Octave'
import {Tempo} from './Tempo'
import {Volume} from './Volume'
import {Instrument} from './Instrument'
import {Macro} from './Macro'
import {Loop} from './Loop'

import type {Characters} from '@/parse/Characters'
import type {Buffer} from '@/evaluate/Buffer'

export class Commands {
  private readonly commands: ICommand[]

  public constructor(chars: Characters, isInScope?: boolean) {
    this.commands = []
    while (chars.get() !== null) {
      const first = chars.get()!
      const ln = first.ln
      const cn = first.cn

      chars.eatSpaces()

      const key = Key.from(chars)
      if (key !== null) {
        this.commands.push(key)
        continue
      }
      const length = Length.from(chars)
      if (length !== null) {
        this.commands.push(length)
        continue
      }
      const note = Note.from(chars)
      if (note !== null) {
        this.commands.push(note)
        continue
      }
      const octave = Octave.from(chars)
      if (octave !== null) {
        this.commands.push(octave)
        continue
      }
      const tempo = Tempo.from(chars)
      if (tempo !== null) {
        this.commands.push(tempo)
        continue
      }
      const volume = Volume.from(chars)
      if (volume !== null) {
        this.commands.push(volume)
        continue
      }
      const instrument = Instrument.from(chars)
      if (instrument !== null) {
        this.commands.push(instrument)
        continue
      }
      const macro = Macro.from(chars)
      if (macro !== null) {
        this.commands.push(macro)
        continue
      }
      const loop = Loop.from(chars)
      if (loop !== null) {
        this.commands.push(loop)
        continue
      }
      if (isInScope === undefined || isInScope === false) {
        throw new Error(`[syntax error] Undefined token found: ${ln} line, ${cn} char.`)
      } else {
        break
      }
    }
  }

  public eval(buffer: Buffer) {
    for (const command of this.commands) {
      command.eval(buffer)
    }
  }

  public isEmpty(): boolean {
    return this.commands.length === 0
  }

  /** A getter for tests. */
  public get(): readonly ICommand[] {
    return this.commands
  }
}
