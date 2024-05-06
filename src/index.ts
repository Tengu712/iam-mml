import {App} from './App'

function getElementById<T>(id: string): T {
  return document.getElementById(id)! as T
}

function addTaEvent(ta: HTMLTextAreaElement, taNumbers: HTMLTextAreaElement, callback: () => void) {
  ta.addEventListener('input', () => {
    const count = ta.value.split('\n').length
    let text = ''
    for (let i = 1; i < count + 1; ++i) {
      text += i + '\n'
    }
    taNumbers.value = text
    taNumbers.scrollTop = ta.scrollTop
    callback()
  })
  ta.addEventListener('scroll', () => (taNumbers.scrollTop = ta.scrollTop))
  taNumbers.value = '1\n'
}

function hhmmss(date: Date) {
  return (
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2) +
    ':' +
    ('0' + date.getSeconds()).slice(-2)
  )
}

document.addEventListener('DOMContentLoaded', () => {
  // sidebar
  const openLog = (() => {
    const divBlinder = getElementById<HTMLDivElement>('blinder')
    const divSidebar = getElementById<HTMLDivElement>('sidebar')
    const divSidebarButton = getElementById<HTMLDivElement>('sidebar-button')
    const divSidebarButtonIcon = getElementById<HTMLDivElement>('sidebar-button-icon')
    let isSidebarShown = false
    const close = () => {
      divBlinder.style.display = 'none'
      divSidebar.style.display = 'none'
      divSidebarButtonIcon.classList.remove('right-triangle')
      divSidebarButtonIcon.classList.add('left-triangle')
      isSidebarShown = false
    }
    const open = () => {
      divBlinder.style.display = 'block'
      divSidebar.style.display = 'flex'
      divSidebarButtonIcon.classList.remove('left-triangle')
      divSidebarButtonIcon.classList.add('right-triangle')
      isSidebarShown = true
    }
    divBlinder.addEventListener('click', () => close())
    divSidebarButton.addEventListener('click', () => (isSidebarShown ? close() : open()))
    return open
  })()

  // resizer
  const divSidebarWrapper = getElementById<HTMLDivElement>('sidebar-wrapper')
  const divSidebarResizer = getElementById<HTMLDivElement>('sidebar-resizer')
  divSidebarResizer.addEventListener('mousedown', (downEvent: MouseEvent) => {
    const up = (upEvent: MouseEvent) => {
      divSidebarWrapper.style.width = downEvent.x - upEvent.x + divSidebarWrapper.clientWidth + 'px'
      document.removeEventListener('mouseup', up)
    }
    document.addEventListener('mouseup', up)
  })
  const divMMLWrapper = getElementById<HTMLDivElement>('mml-wrapper')
  const divTextareaResizer = getElementById<HTMLDivElement>('textarea-resizer')
  divTextareaResizer.addEventListener('mousedown', (downEvent: MouseEvent) => {
    const up = (upEvent: MouseEvent) => {
      divMMLWrapper.style.width = upEvent.x - downEvent.x + divMMLWrapper.clientWidth + 'px'
      document.removeEventListener('mouseup', up)
    }
    document.addEventListener('mouseup', up)
  })

  // get elements
  const btnPlay = getElementById<HTMLButtonElement>('play')
  const btnInfo = getElementById<HTMLButtonElement>('info')
  const taMML = getElementById<HTMLTextAreaElement>('mml')
  const taMMLNumbers = getElementById<HTMLTextAreaElement>('mml-numbers')
  const taInst = getElementById<HTMLTextAreaElement>('inst')
  const taInstNumbers = getElementById<HTMLTextAreaElement>('inst-numbers')
  const taLog = getElementById<HTMLTextAreaElement>('log')

  // add line numbers event
  let isMMLChanged = false
  let isInstChanged = false
  addTaEvent(taMML, taMMLNumbers, () => (isMMLChanged = true))
  addTaEvent(taInst, taInstNumbers, () => (isInstChanged = true))

  // create an app
  const app = new App()

  // add the event listener when clicking the play button
  btnPlay.addEventListener('click', () => {
    try {
      app.play(taMML.value, taInst.value, isMMLChanged, isInstChanged)
      isMMLChanged = false
      isInstChanged = false
    } catch (err: unknown) {
      taLog.value += '(' + hhmmss(new Date()) + ') '
      if (err instanceof Error) {
        taLog.value += err.message + '\n'
      } else {
        taLog.value += err + '\n\n'
      }
      openLog()
    }
  })

  // add the event listener when clicking the info button
  btnInfo.addEventListener('click', () => window.open('./docs/jp/about'))
})
