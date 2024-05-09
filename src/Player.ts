import {SAMPLE_RATE} from './constants'
import {Wave} from './Wave'

export class Player {
  private readonly audioContext: AudioContext
  private readonly audioBuffer: AudioBuffer

  public constructor(wave: Wave) {
    this.audioContext = new AudioContext()

    this.audioBuffer = this.audioContext.createBuffer(1, wave.getSize(), SAMPLE_RATE)
    this.audioBuffer.copyToChannel(wave.getWave(), 0)
  }

  public play() {
    const source = this.audioContext.createBufferSource()
    source.buffer = this.audioBuffer
    source.connect(this.audioContext.destination)
    source.start()
  }
}
