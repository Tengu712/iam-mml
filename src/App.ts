import {Player} from './Player'
import {Wave} from './Wave'
import type {ICommand} from './command/ICommand'
import {Evaluator} from './evaluate/Evaluator'
import {Insts} from './inst/Insts'
import {Parser} from './parse/Parser'

function isCommandsSame(a: readonly ICommand[] | undefined, b: readonly ICommand[]): boolean {
  if (a === undefined) {
    return false
  }
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; ++i) {
    if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) {
      return false
    }
  }
  return true
}

export class App {
  private insts: Insts
  private readonly commandssCache: Map<string, readonly ICommand[]>
  private readonly waveCache: Map<string, Float32Array>
  private player: Player | null

  public constructor() {
    this.insts = new Insts('')
    this.commandssCache = new Map()
    this.waveCache = new Map()
    this.player = null
  }

  public play(mml: string | null, inst: string | null) {
    // if there are no changes
    if (mml === null && inst === null && this.player !== null) {
      this.player.play()
      return
    }

    // parse inst
    if (inst !== null) {
      this.insts = new Insts(inst)
    }

    // parse mml into commands
    let commandss = this.commandssCache
    if (inst !== null && mml === null) {
      throw new Error(
        `[unexpected error] If the instrument definition is changed, mml is needed to be reparsed.`
      )
    }
    if (mml !== null) {
      commandss = Parser.parse(mml, this.insts)
      if (commandss.size === 0) {
        throw new Error('[fatal error] No parts found.')
      }
    }

    // evaluate commands and create wave
    const waves = []
    for (const [partName, commands] of commandss) {
      if (
        inst === null &&
        mml === null &&
        isCommandsSame(this.commandssCache.get(partName), commands) &&
        this.waveCache.has(partName)
      ) {
        waves.push(this.waveCache.get(partName)!)
      } else {
        const wave = Evaluator.eval(commands)
        waves.push(wave)
        this.commandssCache.set(partName, commands)
        this.waveCache.set(partName, wave)
      }
    }

    // play
    if (this.player !== null) {
      this.player.close()
    }
    this.player = new Player(new Wave(waves))
    this.player.play()
  }

  public build(mml: string, inst: string) {
    this.player = null
    this.insts = new Insts(inst)
    const commandss = Parser.parse(mml, this.insts)
    const waves = []
    for (const [partName, commands] of commandss) {
      const wave = Evaluator.eval(commands)
      waves.push(wave)
      this.commandssCache.set(partName, commands)
      this.waveCache.set(partName, wave)
    }
    new Wave(waves).build()
  }

  public pause() {
    this.player?.pause()
  }

  public stop() {
    this.player?.stop()
  }
}
