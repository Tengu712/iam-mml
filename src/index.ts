import {App} from './App'

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

  // create an app
  const app = new App()

  // add the event listener when clicking the play button
  btnPlay.addEventListener('click', () => app.play(taMML.value))
})
