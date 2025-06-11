import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import playIcon from '../assets/play.svg'
import pauseIcon from '../assets/pause.svg'
import stopIcon from '../assets/stop.svg'
import buildIcon from '../assets/build.svg'
import infoIcon from '../assets/info.svg'
import styles from './index.module.css'

function PlaygroundPage() {
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

      <div className={styles.textareaWrapper}>
        <div className={styles.textareaUpper}>
          <div id="mml-wrapper" className={styles.mmlWrapper}>
            <textarea id="mml-numbers" className={styles.mmlNumbers} readOnly></textarea>
            <textarea id="mml" className={styles.mml} spellCheck="false"></textarea>
          </div>
          <div id="textarea-resizer" className={styles.textareaResizer}></div>
          <div className={styles.logWrapper}>
            <textarea id="log" className={styles.log} spellCheck="false"></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaygroundPage
