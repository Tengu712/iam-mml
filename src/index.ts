import {parseMML} from './parser'

function getElementById<T>(id: string): T {
  return document.getElementById(id)! as T
}

document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const btnPlay = getElementById<HTMLButtonElement>('play')
  const taMML = getElementById<HTMLTextAreaElement>('mml')

  // add the event listener when clicking the play button
  btnPlay.addEventListener('click', () => {
    console.log(parseMML(taMML.value))
    /*
      const wave = createWave()
  
      const audioContext = new AudioContext()
      const audioBuffer = createAudioBuffer(audioContext, [wave])
  
      playAudioBuffer(audioContext, audioBuffer)
      */
  })
})
