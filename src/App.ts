import type {ICommand} from './command/ICommand'
import {SAMPLE_RATE} from './constants'
import {Evaluator} from './evaluate/Evaluator'
import {Insts} from './inst/Insts'
import {Parser} from './parse/Parser'

function createAudioBuffer(audioContext: AudioContext, waves: Float32Array[]): AudioBuffer {
  const maxWaveSize = waves.reduce((r, n) => (n.length > r ? n.length : r), 0)
  const audioBuffer = audioContext.createBuffer(waves.length, maxWaveSize, SAMPLE_RATE)
  for (let i = 0; i < waves.length; ++i) {
    audioBuffer.copyToChannel(waves[i], i)
  }
  return audioBuffer
}

function playAudioBuffer(audioContext: AudioContext, audioBuffer: AudioBuffer) {
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioContext.destination)
  source.start()
}

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
  private insts: Insts | null
  private readonly commandssCache: Map<string, readonly ICommand[]>
  private readonly waveCache: Map<string, Float32Array>

  public constructor() {
    this.insts = null
    this.commandssCache = new Map()
    this.waveCache = new Map()
  }

  public play(mml: string, inst: string, isMMLChanged: boolean, isInstChanged: boolean) {
    // parse inst
    if (isInstChanged || this.insts === null) {
      this.insts = new Insts(inst)
    }

    // parse mml into commands
    let commandss = this.commandssCache
    if (isInstChanged || isMMLChanged) {
      commandss = Parser.parse(mml, this.insts)
      if (commandss.size === 0) {
        throw new Error('[fatal error] No parts found.')
      }
    }

    // evaluate commands and create wave
    const waves = []
    for (const [partName, commands] of commandss) {
      if (
        !isInstChanged &&
        !isMMLChanged &&
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
    const audioContext = new AudioContext()
    const audioBuffer = createAudioBuffer(audioContext, waves)
    playAudioBuffer(audioContext, audioBuffer)
  }
}
