import type {Character} from './Character'
import type {ICommand} from '../command/ICommand'
import {Characters} from './Characters'
import {Key} from '../command/Key'
import {Length} from '../command/Length'
import {Note} from '../command/Note'
import {Octave} from '../command/Octave'
import {Tempo} from '../command/Tempo'
import {Volume} from '../command/Volume'
import {Insts} from '../inst/Insts'
import {Instrument} from '../command/Instrument'

/**
 * - no head spaces
 * - no tail spaces
 * - no comments
 * - no empty line
 */
function getLines(mml: string): readonly Character[][] {
  // split into lines
  const splitted = mml.replace(/\r\n|\r/g, '\n').split('\n')
  // for lines
  const lines = []
  for (let ln = 0; ln < splitted.length; ++ln) {
    // remove tail spaces
    const line = splitted[ln].trimEnd()
    // skip head spaces
    let cn = 0
    for (; cn < line.length; ++cn) {
      if (line[cn] !== ' ') {
        break
      }
    }
    // for chars
    const chars = []
    for (; cn < line.length; ++cn) {
      if (line[cn] === ';') {
        break
      }
      chars.push({c: line[cn], ln: ln + 1, cn: cn + 1})
    }
    // push a line
    if (chars.length > 0) {
      lines.push(chars)
    }
  }
  return lines
}

function getParts(lines: readonly Character[][]): Map<string, readonly Character[]> {
  function getPartName(chars: Character[]): {name: string; next: number} {
    for (let i = 0; i < chars.length; ++i) {
      if (chars[i].c === ' ') {
        let name = ''
        for (let j = 0; j < i; ++j) {
          name += chars[j].c
        }
        return {name: name, next: i + 1}
      }
    }
    throw new Error(`[syntax error] The ${chars[0].ln}th line consists only of part names.`)
  }
  const parts = new Map()
  for (const chars of lines) {
    const partName = getPartName(chars)
    if (!parts.has(partName.name)) {
      parts.set(partName.name, [])
    }
    const current = parts.get(partName.name)
    parts.set(partName.name, current.concat(chars.slice(partName.next)))
  }
  return parts
}

export class Parser {
  private constructor() {}

  public static parse(mml: string, insts: Insts): Map<string, readonly ICommand[]> {
    const lines = getLines(mml)
    const parts = getParts(lines)

    const commands = new Map()
    for (const [partName, characters] of parts) {
      const cmds = []
      const chars = new Characters(characters)
      while (chars.get() !== null) {
        const first = chars.get()!
        const ln = first.ln
        const cn = first.cn

        chars.eatSpaces()

        const key = Key.from(chars)
        if (key !== null) {
          cmds.push(key)
          continue
        }
        const length = Length.from(chars)
        if (length !== null) {
          cmds.push(length)
          continue
        }
        const note = Note.from(chars)
        if (note !== null) {
          cmds.push(note)
          continue
        }
        const octave = Octave.from(chars)
        if (octave !== null) {
          cmds.push(octave)
          continue
        }
        const tempo = Tempo.from(chars)
        if (tempo !== null) {
          cmds.push(tempo)
          continue
        }
        const volume = Volume.from(chars)
        if (volume !== null) {
          cmds.push(volume)
          continue
        }
        const instrument = Instrument.from(chars, insts)
        if (instrument !== null) {
          cmds.push(instrument)
          continue
        }
        throw new Error(`[syntax error] Undefined token found: ${ln} line, ${cn} char.`)
      }
      commands.set(partName, cmds)
    }
    return commands
  }
}
