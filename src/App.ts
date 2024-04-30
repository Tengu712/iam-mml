import type {ICommand} from './command/ICommand'
import {SAMPLE_RATE} from './constants'
import {Evaluator} from './evaluate/Evaluator'
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

function isCommandsSame(a: readonly ICommand[], b: readonly ICommand[]): boolean {
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
  private readonly commandsCache: Map<string, readonly ICommand[]>
  private readonly waveCache: Map<string, Float32Array>

  public constructor() {
    this.commandsCache = new Map()
    this.waveCache = new Map()
  }

  public play(mml: string) {
    // parse mml into commands
    const commandMap = Parser.parse(mml)
    if (commandMap.size === 0) {
      throw new Error('[fatal error] No parts found.')
    }

    // evaluate commands and create wave
    const waves = []
    for (const [partName, commands] of commandMap) {
      if (
        this.commandsCache.has(partName) &&
        isCommandsSame(this.commandsCache.get(partName)!, commands) &&
        this.waveCache.has(partName)
      ) {
        waves.push(this.waveCache.get(partName)!)
      } else {
        const wave = Evaluator.eval(commands)
        waves.push(wave)
        this.commandsCache.set(partName, commands)
        this.waveCache.set(partName, wave)
      }
    }

    // play
    const audioContext = new AudioContext()
    const audioBuffer = createAudioBuffer(audioContext, waves)
    playAudioBuffer(audioContext, audioBuffer)
  }
}
