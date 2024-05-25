import {Player} from '@/Player'
import {Wave} from '@/Wave'
import {Commands} from '@/command/Commands'
import {Evaluator} from '@/evaluate/Evaluator'
import {checkCharsSame} from '@/parse/Character'
import {Characters} from '@/parse/Characters'
import {PartDefs} from '@/parse/PartDefs'
import {Parser} from '@/parse/Parser'
import type {MacroDefs} from '@/parse/MacroDefs'
import type {InstDefs} from '@/parse/InstDefs'

export class App {
  private macroDefsCache: MacroDefs | null
  private instDefsCache: InstDefs | null

  private partDefsCache: PartDefs
  private waveCache: Map<string, Float32Array>
  private player: Player | null

  public constructor() {
    this.macroDefsCache = null
    this.instDefsCache = null

    this.partDefsCache = new PartDefs()
    this.waveCache = new Map()
    this.player = null
  }

  public prepare(mml: string, inst: string) {
    // parse
    const [partDefs, macroDefs, instDefs] = Parser.parse(mml, inst)
    if (partDefs.len() === 0) {
      throw new Error('[fatal error] No parts found.')
    }

    // evaluate commands and create wave
    // Use the cached wave when the following conditions are met:
    //   - score cache is found
    //   - wave cache is found
    //   - score is the same as that cache
    //   - macro defs cache isn't null
    //   - inst defs cache isn't null
    //   - macro defs is the same as that cache
    //   - inst defs is the same as that cache
    const waves = []
    const waveCache = new Map()
    for (const [partName, partChars] of partDefs.iter()) {
      const cached = this.partDefsCache.get(partName)
      if (
        cached !== null &&
        this.waveCache.has(partName) &&
        this.macroDefsCache !== null &&
        this.instDefsCache !== null &&
        checkCharsSame(cached, partChars) &&
        this.macroDefsCache.isSame(macroDefs) &&
        this.instDefsCache.isSame(instDefs)
      ) {
        waves.push(this.waveCache.get(partName)!)
        waveCache.set(partName, this.waveCache.get(partName)!)
      } else {
        const chars = new Characters(partChars)
        const commands = new Commands(chars)
        const wave = Evaluator.eval(commands, macroDefs, instDefs)
        waves.push(wave)
        waveCache.set(partName, wave)
      }
    }

    // cache
    this.partDefsCache.clear()
    this.waveCache.clear()
    this.partDefsCache = partDefs
    this.waveCache = waveCache

    // recreate this.player
    if (this.player !== null) {
      this.player.close()
    }
    this.player = new Player(new Wave(waves))
  }

  public play() {
    if (this.player === null) {
      throw new Error(`[unexpected error] Tried to play null player.`)
    }
    this.player.play()
  }

  public build() {
    const waves = []
    for (const wave of this.waveCache.values()) {
      waves.push(wave)
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
