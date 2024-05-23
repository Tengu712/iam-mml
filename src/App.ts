import {Player} from './Player'
import {Wave} from './Wave'
import {Commands} from './command/Commands'
import {Evaluator} from './evaluate/Evaluator'
import {Insts} from './inst/Insts'
import type {Character} from './parse/Character'
import {Characters} from './parse/Characters'
import {PartDefs} from './parse/PartDefs'
import {Preprocessor} from './parse/Preprocessor'

function isCharsSame(
  a: readonly Character[] | undefined,
  b: readonly Character[] | undefined
): boolean {
  if (a === undefined) {
    return false
  }
  if (b === undefined) {
    return false
  }
  if (a.length !== b.length) {
    return false
  }
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    return false
  }
  return true
}

export class App {
  private instDefsCache: Insts
  private partDefsCache: PartDefs
  private waveCache: Map<string, Float32Array>
  private player: Player | null

  public constructor() {
    this.instDefsCache = new Insts('')
    this.partDefsCache = new PartDefs()
    this.waveCache = new Map()
    this.player = null
  }

  public play(mml: string | null, inst: string | null) {
    // check an unexpected error
    if (inst !== null && mml === null) {
      throw new Error(
        `[unexpected error] If the instrument definition is changed, mml is needed to be reparsed.`
      )
    }

    // if there are no changes
    if (mml === null && this.player !== null) {
      this.player.play()
      return
    }

    // check an unexpected error
    if (mml === null) {
      throw new Error(`[fatal error] No input is passed. Try again after changing the code.`)
    }

    // parse inst
    if (inst !== null) {
      this.instDefsCache = new Insts(inst)
    }

    // preprocess
    const preprocessor = new Preprocessor(mml)
    if (preprocessor.getPartDefs().len() === 0) {
      throw new Error('[fatal error] No parts found.')
    }

    // evaluate commands and create wave
    const waves = []
    const waveCache = new Map()
    for (const [partName, partChars] of preprocessor.getPartDefs().iter()) {
      const cached = this.partDefsCache.get(partName)
      if (cached !== null && isCharsSame(cached, partChars) && this.waveCache.has(partName)) {
        waves.push(this.waveCache.get(partName)!)
        waveCache.set(partName, this.waveCache.get(partName)!)
      } else {
        const chars = new Characters(partChars)
        const commands = new Commands(chars, preprocessor.getMacroDefs(), this.instDefsCache)
        const wave = Evaluator.eval(commands.get())
        waves.push(wave)
        waveCache.set(partName, wave)
      }
    }

    // cache
    this.partDefsCache.clear()
    this.waveCache.clear()
    this.partDefsCache = preprocessor.getPartDefs()
    this.waveCache = waveCache

    // play
    if (this.player !== null) {
      this.player.close()
    }
    this.player = new Player(new Wave(waves))
    this.player.play()
  }

  public build(mml: string, inst: string) {
    this.partDefsCache.clear()
    this.waveCache.clear()

    this.instDefsCache = new Insts(inst)
    const preprocessor = new Preprocessor(mml)
    if (preprocessor.getPartDefs().len() === 0) {
      throw new Error('[fatal error] No parts found.')
    }
    const waves = []
    const waveCache = new Map()
    for (const [partName, partChars] of preprocessor.getPartDefs().iter()) {
      const cached = this.partDefsCache.get(partName)
      const chars = new Characters(partChars)
      const commands = new Commands(chars, preprocessor.getMacroDefs(), this.instDefsCache)
      const wave = Evaluator.eval(commands.get())
      waves.push(wave)
      waveCache.set(partName, wave)
    }
    this.partDefsCache = preprocessor.getPartDefs()
    this.waveCache = waveCache
    new Wave(waves).build()
  }

  public pause() {
    this.player?.pause()
  }

  public stop() {
    this.player?.stop()
  }
}
