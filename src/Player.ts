import {SAMPLE_RATE} from './constants'

export class Player {
  private readonly audioContext: AudioContext
  private readonly audioBuffer: AudioBuffer

  public constructor(waves: Float32Array[]) {
    this.audioContext = new AudioContext()

    const maxWaveSize = waves.reduce((r, n) => (n.length > r ? n.length : r), 0)
    const wave = new Float32Array(maxWaveSize)
    for (const n of waves) {
      for (let i = 0; i < n.length; ++i) {
        wave[i] += n[i]
      }
    }
    this.audioBuffer = this.audioContext.createBuffer(1, maxWaveSize, SAMPLE_RATE)
    this.audioBuffer.copyToChannel(wave, 0)
  }

  public play() {
    const source = this.audioContext.createBufferSource()
    source.buffer = this.audioBuffer
    source.connect(this.audioContext.destination)
    source.start()
  }
}
