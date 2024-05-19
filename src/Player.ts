import {SAMPLE_RATE} from './constants'
import {Wave} from './Wave'

export class Player {
  private readonly audioContext: AudioContext
  private readonly audioBuffer: AudioBuffer
  private source: AudioBufferSourceNode | null
  private isPaused: boolean

  public constructor(wave: Wave) {
    this.audioContext = new AudioContext()

    this.audioBuffer = this.audioContext.createBuffer(1, wave.getSize(), SAMPLE_RATE)
    this.audioBuffer.copyToChannel(wave.getWave(), 0)

    this.source = null
    this.isPaused = false
  }

  public close() {
    this.source?.stop()
    this.audioContext.close()
  }

  public play() {
    // playing -> nothing to do
    // paused -> resume
    if (this.source !== null) {
      if (this.isPaused) {
        this.audioContext.resume().then(() => (this.isPaused = false))
      }
      return
    }
    // otherwise -> start from the beginning
    this.source = this.audioContext.createBufferSource()
    this.source.buffer = this.audioBuffer
    this.source.connect(this.audioContext.destination)
    this.source.addEventListener('ended', () => this.end())
    this.source.start()
  }

  public pause() {
    if (this.source !== null) {
      this.audioContext.suspend().then(() => (this.isPaused = true))
    }
  }

  public stop() {
    if (this.source !== null) {
      this.source.stop()
      this.end()
    }
  }

  private end() {
    this.source = null
    if (this.isPaused) {
      this.audioContext.resume().then(() => (this.isPaused = false))
    }
  }
}
