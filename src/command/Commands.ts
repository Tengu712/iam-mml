import type {ICommand} from './ICommand'
import {Key} from './Key'
import {Length} from './Length'
import {Note} from './Note'
import {Octave} from './Octave'
import {Tempo} from './Tempo'
import {Volume} from './Volume'
import {Instrument} from './Instrument'

import type {Insts} from '@/inst/Insts'
import type {Characters} from '@/parse/Characters'
import type {MacroDefs} from '@/parse/MacroDefs'

export class Commands {
  private readonly commands: ICommand[]

  public constructor(chars: Characters, macroDefs: MacroDefs, instDefs: Insts) {
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
      const instrument = Instrument.from(chars, instDefs)
      if (instrument !== null) {
        this.commands.push(instrument)
        continue
      }
      throw new Error(`[syntax error] Undefined token found: ${ln} line, ${cn} char.`)
    }
  }

  public get(): readonly ICommand[] {
    return this.commands
  }
}
