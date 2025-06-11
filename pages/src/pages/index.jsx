import { useCallback, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import playIcon from '../assets/play.svg'
import pauseIcon from '../assets/pause.svg'
import stopIcon from '../assets/stop.svg'
import buildIcon from '../assets/build.svg'
import infoIcon from '../assets/info.svg'
import styles from './index.module.css'

function useAudioPlayer() {
  const [audioContext] = useState(() => new AudioContext())
  const [audioBuffer, setAudioBuffer] = useState(null)
  const [audioBufferSource, setAudioBufferSource] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [prevMml, setPrevMml] = useState("")

  const end = useCallback(() => {
    if (audioBufferSource !== null) {
      audioBufferSource.stop()
      audioBufferSource.disconnect()
      if (isPaused) {
        audioContext.resume().then(() => setIsPaused(false))
      }
      setAudioBufferSource(null)
    }
  }, [audioBufferSource, isPaused, audioContext])

  const play = useCallback(() => {
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    source.addEventListener("ended", () => end())
    source.start()
    setAudioBufferSource(source)
    setIsPaused(false)
  }, [audioContext, audioBuffer, end])

  const handlePlay = useCallback((mmlValue, build, logCallback) => {
    if (mmlValue === prevMml && audioBuffer !== null) {
      if (isPaused) {
        audioContext.resume().then(() => setIsPaused(false))
      } else if (audioBufferSource === null) {
        play()
      }
      return
    }

    end()
    setAudioBuffer(null)

    let wave
    try {
      wave = build(mmlValue)
      logCallback("info: compile succeeded.\n")
    } catch (err) {
      logCallback("error: " + err + "\n")
      return
    }

    const buffer = audioContext.createBuffer(1, wave.length, 44100)
    buffer.copyToChannel(wave, 0)
    setAudioBuffer(buffer)

    const source = audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(audioContext.destination)
    source.addEventListener("ended", () => end())
    source.start()
    setAudioBufferSource(source)
    setIsPaused(false)

    setPrevMml(mmlValue)
  }, [prevMml, audioBuffer, isPaused, audioBufferSource, audioContext, end, play])

  const handlePause = useCallback(() => {
    if (audioBufferSource !== null && !isPaused) {
      audioContext.suspend().then(() => setIsPaused(true))
    }
  }, [audioBufferSource, isPaused, audioContext])

  const handleStop = useCallback(() => end(), [end])

  return { handlePlay, handlePause, handleStop }
}

function Resizer({ targetRef, maxWidth }) {
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  const handleMouseDown = useCallback((evt) => {
    setIsDragging(true)
    startXRef.current = evt.clientX
    startWidthRef.current = targetRef.current.clientWidth
  }, [targetRef])
  const handleMouseUp = useCallback(() => setIsDragging(false), [])
  const handleMouseMove = useCallback((evt) => {
    if (!isDragging || !targetRef.current) {
      return
    }
    const deltaX = evt.clientX - startXRef.current
    const newWidth = startWidthRef.current + deltaX
    const clampedWidth = Math.min(newWidth, maxWidth)
    targetRef.current.style.width = clampedWidth + 'px'
  }, [isDragging, targetRef, maxWidth])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      className={styles.textareaResizer}
      onMouseDown={handleMouseDown}
    />
  )
}

function TextAreas({ mmlValue, onMmlChange, logValue }) {
  // for Resizer to resize textarea
  const mmlWrapperRef = useRef(null)
  const [mmlWrapperMaxWidth, setMmlWrapperMaxWidth] = useState(200)
  useEffect(() => {
    if (mmlWrapperRef.current) {
      setMmlWrapperMaxWidth(mmlWrapperRef.current.parentElement.clientWidth - 3 - 100)
    }
  }, [])

  // for sync scroll
  const numbersRef = useRef(null)
  const setScrollTop = useCallback((n) => {
    if (numbersRef.current) {
      numbersRef.current.scrollTop = n
    }
  }, [])
  const handleScroll = useCallback((evt) => setScrollTop(evt.target.scrollTop), [])

  // for show line numbers
  // for notify mml value change
  const [numbers, setNumbers] = useState("1")
  const handleInput = useCallback((evt) => {
    const value = evt.target.value
    const linesCount = value.split("\n").length
    let numbersValue = ""
    for (let i = 1; i < linesCount + 1; ++i) {
      numbersValue += i + "\n"
    }
    setNumbers(numbersValue)
    setScrollTop(evt.target.scrollTop)
    if (onMmlChange) {
      onMmlChange(value)
    }
  }, [onMmlChange])

  // for insert tab
  // for notify mml value change
  const handleKeyDown = useCallback((evt) => {
    if (evt.key !== "Tab") {
      return
    }
    evt.preventDefault()
    const start = evt.target.selectionStart
    const end = evt.target.selectionEnd
    evt.target.value = evt.target.value.substring(0, start) + "\t" + evt.target.value.substring(end)
    evt.target.selectionStart = start + 1
    evt.target.selectionEnd = start + 1
    if (onMmlChange) {
      onMmlChange(evt.target.value)
    }
  }, [onMmlChange])

  return (
    <div className={styles.textareaWrapper}>
      <div ref={mmlWrapperRef} className={styles.mmlWrapper}>
        <textarea
          ref={numbersRef}
          className={styles.mmlNumbers}
          value={numbers}
          readOnly
        />
        <textarea
          className={styles.mml}
          value={mmlValue}
          onScroll={handleScroll}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />
      </div>
      <Resizer
        targetRef={mmlWrapperRef} 
        maxWidth={mmlWrapperMaxWidth}
      />
      <div className={styles.logWrapper}>
        <textarea
          className={styles.log}
          value={logValue}
          spellCheck={false}
          readOnly
        />
      </div>
    </div>
  )
}

function PlaygroundPage() {
  useEffect(() => { document.title = 'IAM.mml' }, [])

  // for load wasm
  const wasmLoading = useRef(true)
  const [wasm, setWasm] = useState(null)
  useEffect(() => {
    if (wasmLoading.current) {
      wasmLoading.current = false
    } else {
      return
    }
    const loadWasm = async () => {
      const wasmjs = await import("../assets/wasm/iamw.js")
      await wasmjs.default()
      setWasm(wasmjs)
    }
    loadWasm()
  }, [])

  const { handlePlay, handlePause, handleStop } = useAudioPlayer()
  const [mmlValue, setMmlValue] = useState("")
  const [logValue, setLogValue] = useState("")

  // for play
  const onPlayClick = useCallback(() => {
    if (wasm) {
      handlePlay(mmlValue, wasm.build, (n) => setLogValue((p) => { p += n }))
    }
  }, [mmlValue, wasm, handlePlay])

  // for build & dowload
  const onBuildClick = useCallback(() => {
    if (wasm) {
      try {
        const wave = wasm.generate(mmlValue)
        const blob = new Blob([wave], { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'output.wav'
        a.click()
        URL.revokeObjectURL(url)
        setLogValue((p) => { p += "info: build and download succeeded.\n" })
      } catch (err) {
        setLogValue((p) => { p += "error: " + err + "\n" })
      }
    }
  }, [mmlValue, wasm])

  return (
    <div className={styles.main}>
      <div className={styles.buttonWrapper}>
        <button onClick={onPlayClick} className={styles.redButton} title="Play the music">
          <img src={playIcon} />
        </button>
        <button onClick={handlePause} className={styles.redButton} title="Pause the music">
          <img src={pauseIcon} />
        </button>
        <button onClick={handleStop} className={`${styles.redButton} ${styles.stop}`} title="Stop the music">
          <img src={stopIcon} />
        </button>
        <button onClick={onBuildClick} className={styles.whiteButton} title="Build and download the music">
          <img src={buildIcon} />
        </button>
        <button className={`${styles.whiteButton} ${styles.info}`} title="Go to IAM.mml Docs">
          <Link to="/docs/jp/about/">
            <img src={infoIcon} />
          </Link>
        </button>
      </div>

      <TextAreas 
        mmlValue={mmlValue}
        onMmlChange={setMmlValue}
        logValue={logValue}
      />
    </div>
  )
}

export default PlaygroundPage
