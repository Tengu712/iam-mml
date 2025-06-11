import playIcon from '../assets/play.svg'
import pauseIcon from '../assets/pause.svg'
import stopIcon from '../assets/stop.svg'
import buildIcon from '../assets/build.svg'
import infoIcon from '../assets/info.svg'
import './index.css'

function setupTextArea(numbers, codes) {
  const taNumbers = document.getElementById(numbers)
  const taCodes = document.getElementById(codes)
  taNumbers.value = "1\n"
  taCodes.addEventListener("scroll", () => (taNumbers.scrollTop = taCodes.scrollTop))
  taCodes.addEventListener("input", () => {
    const linesCount = taCodes.value.split("\n").length
    let taNumbersValue = ""
    for (let i = 1; i < linesCount + 1; ++i) {
      taNumbersValue += i + "\n"
    }
    taNumbers.value = taNumbersValue
    taNumbers.scrollTop = taCodes.scrollTop
  })
  taCodes.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault()
      const start = taCodes.selectionStart
      const end = taCodes.selectionEnd
      taCodes.value = taCodes.value.substring(0, start) + "\t" + taCodes.value.substring(end)
      taCodes.selectionStart = start + 1
      taCodes.selectionEnd = start + 1
    }
  })
}

window.addEventListener("DOMContentLoaded", async () => {
  await init()

  const mmlTextArea = document.getElementById("mml")
  const logTextArea = document.getElementById("log")
  setupTextArea("mml-numbers", "mml")

  const audioContext = new AudioContext()
  let audioBuffer = null
  let audioBufferSource = null
  let isPaused = false

  const end = () => {
    if (audioBufferSource !== null) {
      audioBufferSource.stop()
      audioBufferSource.disconnect()
      if (isPaused) {
        audioContext.resume().then(() => (isPaused = false))
      }
      audioBufferSource = null
    }
  }

  const play = () => {
    audioBufferSource = audioContext.createBufferSource()
    audioBufferSource.buffer = audioBuffer
    audioBufferSource.connect(audioContext.destination)
    audioBufferSource.addEventListener("ended", () => end())
    audioBufferSource.start()
    isPaused = false
  }

  let prevMML = ""

  document.getElementById("play").addEventListener("click", () => {
    // no change
    if (mmlTextArea.value === prevMML && audioBuffer !== null) {
      // paused -> resume
      if (isPaused) {
        audioContext.resume().then(() => (isPaused = false))
      }
      // ended -> replay
      else if (audioBufferSource === null) {
        play()
      }
      return
    }

    // initialize
    end()
    audioBuffer = null

    // compile
    let wave
    try {
      wave = build(mmlTextArea.value)
      logTextArea.value += "info: compile succeeded.\n"
    } catch (err) {
      logTextArea.value += "error: " + err + "\n"
      return
    }

    // create buffer
    audioBuffer = audioContext.createBuffer(1, wave.length, 44100)
    audioBuffer.copyToChannel(wave, 0)

    // play
    play()

    // finish
    prevMML = mmlTextArea.value
  })

  document.getElementById("pause").addEventListener("click", () => {
    if (!isPaused && audioBufferSource !== null) {
      audioContext.suspend().then(() => (isPaused = true))
    }
  })

  document.getElementById("stop").addEventListener("click", () => end())

  document.getElementById("build").addEventListener("click", () => {
    try {
      const waveFile = generate(mmlTextArea.value)
      logTextArea.value += "info: generating a WAVE file succeeded.\n"
      const url = window.URL.createObjectURL(new Blob([waveFile], {type: 'audio/wav'}))
      const a = document.createElement('a')
      a.href = url
      a.download = 'audio.wav'
      a.click()
    } catch (err) {
      logTextArea.value += "error: " + err + "\n"
    }
  })

  document.getElementById("info").addEventListener("click", () => window.open("./docs/jp/about"))

  const resizer = document.getElementById("textarea-resizer")
  const target = document.getElementById("mml-wrapper")
  let start = 0
  const onMouseUp = (event) => {
    target.style.width = (event.x - start) + target.clientWidth + 'px'
    document.removeEventListener('mouseup', onMouseUp)
  }
  const onMouseDown = (event) => {
    start = event.x
    document.addEventListener('mouseup', onMouseUp)
  }
  resizer.addEventListener('mousedown', onMouseDown)
})

export default function PlaygroundPage() {
  return (
    <div id="main">
      <div id="button-wrapper">
        <button id="play" className="red-button" title="Play the music">
          <img src={playIcon} />
        </button>
        <button id="pause" className="red-button" title="Pause the music">
          <img src={pauseIcon} />
        </button>
        <button id="stop" className="red-button" title="Stop the music">
          <img src={stopIcon} />
        </button>
        <button id="build" className="white-button" title="Build and download the music">
          <img src={buildIcon} />
        </button>
        <button id="info" className="white-button" title="Go to IAM.mml Docs">
          <img src={infoIcon} />
        </button>
      </div>

      <div id="textarea-wrapper">
        <div id="textarea-upper">
          <div id="mml-wrapper">
            <textarea id="mml-numbers" readOnly></textarea>
            <textarea id="mml" spellCheck="false"></textarea>
          </div>
          <div id="textarea-resizer"></div>
          <div id="log-wrapper">
            <textarea id="log" spellCheck="false"></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}
