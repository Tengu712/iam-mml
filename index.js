const SAMPLE_RATE = 44100
const PER_SAMPLE_RATE = 1 / SAMPLE_RATE
const SIZE_OF_32BITS = 4

// DEBUG
function createWave() {
  const length = SAMPLE_RATE * 2
  const wave = new Float32Array(length)
  for (let i = 0; i < length; ++i) {
    wave[i] = Math.sin(2 * Math.PI * 440 * PER_SAMPLE_RATE * i)
  }
  return wave
}

function createAudioBuffer(audioContext, waveBuffers) {
  const maxWaveBufferSize = waveBuffers.reduce((a, b) => Math.max(a.length, b.length)).length
  const audioBuffer = audioContext.createBuffer(waveBuffers.length, maxWaveBufferSize, SAMPLE_RATE)
  for (let i = 0; i < waveBuffers.length; ++i) {
    audioBuffer.copyToChannel(waveBuffers[i], i)
  }
  return audioBuffer
}

function playAudioBuffer(audioContext, audioBuffer) {
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioContext.destination)
  source.start()
}

document.addEventListener("DOMContentLoaded", () => {
  // get elements
  const btnPlay = document.getElementById("play")
  const taMML = document.getElementById("mml")

  // add the event listener when clicking the play button
  btnPlay.addEventListener("click", () => {
    const wave = createWave()

    const audioContext = new AudioContext()
    const audioBuffer = createAudioBuffer(audioContext, [wave])

    playAudioBuffer(audioContext, audioBuffer)
  })
})
