import { useEffect, useState, useRef } from 'react'
import playIcon from '../assets/play.svg'
import pauseIcon from '../assets/pause.svg'
import stopIcon from '../assets/stop.svg'
import buildIcon from '../assets/build.svg'
import infoIcon from '../assets/info.svg'
import './index.css'

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
    <div id="main" className="playground-page">
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

export default PlaygroundPage
