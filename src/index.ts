import {SAMPLE_RATE, evaluate} from './evaluator'
import {parseMML} from './parser'

function getElementById<T>(id: string): T {
  return document.getElementById(id)! as T
}

function getMaxWaveSize(waves: Float32Array[]): number {
  let max = 0
  for (const wave of waves) {
    max = wave.length > max ? wave.length : max
  }
  return max
}

function createAudioBuffer(audioContext: AudioContext, waves: Float32Array[]): AudioBuffer {
  const maxWaveSize = getMaxWaveSize(waves)
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

document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const btnPlay = getElementById<HTMLButtonElement>('play')
  const taMML = getElementById<HTMLTextAreaElement>('mml')

  // add the event listener when clicking the play button
  btnPlay.addEventListener('click', () => {
    const tokensPerPart = parseMML(taMML.value)
    const waves = evaluate(tokensPerPart)
    const audioContext = new AudioContext()
    const audioBuffer = createAudioBuffer(audioContext, waves)
    playAudioBuffer(audioContext, audioBuffer)
  })
})
