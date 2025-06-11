import { useCallback, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import playIcon from '../assets/play.svg'
import pauseIcon from '../assets/pause.svg'
import stopIcon from '../assets/stop.svg'
import buildIcon from '../assets/build.svg'
import infoIcon from '../assets/info.svg'
import styles from './index.module.css'

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

function TextAreas() {
  const [numbers, setNumbers] = useState("1")
  const [mmlWrapperMaxWidth, setMmlWrapperMaxWidth] = useState(200)
  const numbersRef = useRef(null)
  const mmlWrapperRef = useRef(null)

  useEffect(() => {
    if (mmlWrapperRef.current) {
      setMmlWrapperMaxWidth(mmlWrapperRef.current.parentElement.clientWidth - 3 - 100)
    }
  }, [])

  const setScrollTop = useCallback((n) => {
    if (numbersRef.current) {
      numbersRef.current.scrollTop = n
    }
  }, [])
  const handleScroll = useCallback((evt) => setScrollTop(evt.target.scrollTop), [])
  const handleInput = useCallback((evt) => {
    const linesCount = evt.target.value.split("\n").length
    let numbersValue = ""
    for (let i = 1; i < linesCount + 1; ++i) {
      numbersValue += i + "\n"
    }
    setNumbers(numbersValue)
    setScrollTop(evt.target.scrollTop)
  }, [])
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
  }, [])

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
          spellCheck={false}
        />
      </div>
    </div>
  )
}

function PlaygroundPage() {
  useEffect(() => { document.title = 'IAM.mml' }, [])

  const wasmLoading = useRef(true)

  useEffect(() => {
    if (wasmLoading.current) {
      wasmLoading.current = false
    } else {
      return
    }
    const loadWasm = async () => {
      const wasm = await import("../assets/wasm/iamw.js")
      await wasm.default()
    }
    loadWasm()
  }, [])


  return (
    <div className={styles.main}>
      <div className={styles.buttonWrapper}>
        <button id="play" className={styles.redButton} title="Play the music">
          <img src={playIcon} />
        </button>
        <button id="pause" className={styles.redButton} title="Pause the music">
          <img src={pauseIcon} />
        </button>
        <button id="stop" className={`${styles.redButton} ${styles.stop}`} title="Stop the music">
          <img src={stopIcon} />
        </button>
        <button id="build" className={styles.whiteButton} title="Build and download the music">
          <img src={buildIcon} />
        </button>
        <button className={`${styles.whiteButton} ${styles.info}`} title="Go to IAM.mml Docs">
          <Link to="/docs/jp/about/">
            <img src={infoIcon} />
          </Link>
        </button>
      </div>

      <TextAreas />
    </div>
  )
}

export default PlaygroundPage
