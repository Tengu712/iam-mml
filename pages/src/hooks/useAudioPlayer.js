import { useState } from 'react'

function end(context, source, setSource, paused, setPaused) {
  if (!context || !source) {
    return
  }
  source.stop()
  source.disconnect()
  setSource(null)
  if (paused) {
    context.resume().then(() => setPaused(false))
  }
}

function play(context, buffer, setSource, setPaused) {
  if (!context || !buffer) {
    return
  }
  const source = context.createBufferSource()
  source.buffer = buffer
  source.connect(context.destination)
  source.addEventListener("ended", () => end(context, source, setSource, false, setPaused))
  source.start()
  setSource(source)
  setPaused(false)
}

function resume(context, buffer, source, setSource, paused, setPaused) {
  if (context === null || buffer === null) {
    return
  }
  // paused
  if (paused) {
    context.resume().then(() => setPaused(false))
  }
  // ended
  // TODO: check
  else if (source === null) {
    play(context, buffer, setSource, setPaused)
  }
  // playing
  else {}
}

function useAudioPlayer() {
  const [context] = useState(() => new AudioContext())
  const [buffer, setBuffer] = useState(null)
  const [source, setSource] = useState(null)
  const [paused, setPaused] = useState(false)
  const [prevMml, setPrevMml] = useState("")

  const handlePlay = (mmlValue, build, logCallback) => {
    // cached
    if (mmlValue === prevMml && buffer !== null) {
      resume(context, buffer, source, setSource, paused, setPaused)
      return
    }

    end(context, source, setSource, paused, setPaused)

    let wave
    try {
      wave = build(mmlValue)
      logCallback("info: compile succeeded.\n")
    } catch (err) {
      logCallback("error: " + err + "\n")
      return
    }
    setPrevMml(mmlValue)

    const b = context.createBuffer(1, wave.length, 44100)
    b.copyToChannel(wave, 0)
    setBuffer(b)

    play(context, b, setSource, setPaused)
  }

  const handlePause = () => {
    if (source !== null && !paused) {
      context.suspend().then(() => setPaused(true))
    }
  }

  const handleStop = () => end(context, source, setSource, paused, setPaused)

  return { handlePlay, handlePause, handleStop }
}

export default useAudioPlayer
