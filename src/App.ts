import {Player} from '@/Player'
import {Wave} from '@/Wave'
import {Commands} from '@/command/Commands'
import {Evaluator} from '@/evaluate/Evaluator'
import type {Character} from '@/parse/Character'
import {Characters} from '@/parse/Characters'
import {PartDefs} from '@/parse/PartDefs'
import {Parser} from '@/parse/Parser'

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
  private partDefsCache: PartDefs
  private waveCache: Map<string, Float32Array>
  private player: Player | null

  public constructor() {
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
    const waves = []
    const waveCache = new Map()
    for (const [partName, partChars] of partDefs.iter()) {
      const cached = this.partDefsCache.get(partName)
      if (cached !== null && isCharsSame(cached, partChars) && this.waveCache.has(partName)) {
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
