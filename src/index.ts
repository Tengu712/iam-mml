import {SAMPLE_RATE} from './constants'
import {Evaluator} from './evaluate/Evaluator'
import {Parser} from './parse/Parser'

function getElementById<T>(id: string): T {
  return document.getElementById(id)! as T
}

function addLineNumbersEvent(ta: HTMLTextAreaElement, taNumbers: HTMLTextAreaElement) {
  ta.addEventListener('input', () => {
    const count = ta.value.split('\n').length
    let text = ''
    for (let i = 1; i < count + 1; ++i) {
      text += i + '\n'
    }
    taNumbers.value = text
    taNumbers.scrollTop = ta.scrollTop
  })
  ta.addEventListener('scroll', () => (taNumbers.scrollTop = ta.scrollTop))
  taNumbers.value = '1\n'
}

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

document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const btnPlay = getElementById<HTMLButtonElement>('play')
  const taMML = getElementById<HTMLTextAreaElement>('mml')
  const taMMLNumbers = getElementById<HTMLTextAreaElement>('mml-numbers')
  const taInst = getElementById<HTMLTextAreaElement>('inst')
  const taInstNumbers = getElementById<HTMLTextAreaElement>('inst-numbers')

  // add line numbers event
  addLineNumbersEvent(taMML, taMMLNumbers)
  addLineNumbersEvent(taInst, taInstNumbers)

  // add the event listener when clicking the play button
  btnPlay.addEventListener('click', () => {
    const commandMap = Parser.parse(taMML.value)
    const waves = []
    for (const [_, commands] of commandMap) {
      waves.push(Evaluator.eval(commands))
    }
    const audioContext = new AudioContext()
    const audioBuffer = createAudioBuffer(audioContext, waves)
    playAudioBuffer(audioContext, audioBuffer)
  })
})
