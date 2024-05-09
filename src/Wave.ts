import {SAMPLE_RATE} from './constants'

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; ++i) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

function writeWaveAs16Bit(view: DataView, offset: number, wave: Float32Array) {
  for (const w of wave) {
    const v = Math.max(Math.min(w, 1), -1)
    const p = v < 0 ? v * 0x8000 : v * 0x7fff
    view.setInt16(offset, p, true)
    offset += 2
  }
}

export class Wave {
  private readonly size: number
  private readonly wave: Float32Array

  public constructor(waves: Float32Array[]) {
    this.size = waves.reduce((r, n) => (n.length > r ? n.length : r), 0)
    this.wave = new Float32Array(this.size)
    for (const n of waves) {
      for (let i = 0; i < n.length; ++i) {
        this.wave[i] += n[i]
      }
    }
  }

  public getSize(): number {
    return this.size
  }

  public getWave(): Float32Array {
    return this.wave
  }

  public build() {
    const BYTES_COUNT_PER_SAMPLE = 2
    const buffer = new ArrayBuffer(44 + this.size * BYTES_COUNT_PER_SAMPLE)
    const view = new DataView(buffer)

    writeString(view, 0, 'RIFF')
    view.setUint32(4, 32 + this.size, true)
    writeString(view, 8, 'WAVE')

    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, SAMPLE_RATE, true)
    view.setUint32(28, SAMPLE_RATE * BYTES_COUNT_PER_SAMPLE, true)
    view.setUint16(32, BYTES_COUNT_PER_SAMPLE, true)
    view.setUint16(34, BYTES_COUNT_PER_SAMPLE * 8, true)

    writeString(view, 36, 'data')
    view.setUint32(40, this.size * BYTES_COUNT_PER_SAMPLE, true)
    writeWaveAs16Bit(view, 44, this.wave)

    const url = window.URL.createObjectURL(new Blob([view], {type: 'audio/wav'}))
    const a = document.createElement('a')
    a.href = url
    a.download = 'wave.wav'
    a.click()
  }
}
