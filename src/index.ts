import {App} from './App'
import {Codearea} from './component/Codearea'
import {Resizer} from './component/Resizer'
import {Sidebar} from './component/Sidebar'
import {getElementById} from './component/getElement'

document.addEventListener('DOMContentLoaded', () => {
  // create an app
  const app = new App()

  // components
  const sidebar = new Sidebar()
  const caMML = new Codearea('mml', 'mml-numbers')
  const caInst = new Codearea('inst', 'inst-numbers')
  const _sidebarResizer = new Resizer('sidebar-resizer', 'sidebar-wrapper', false)
  const _mmlResizer = new Resizer('textarea-resizer', 'mml-wrapper', true)

  // add an event listener to the play button
  const btnPlay = getElementById<HTMLButtonElement>('play')
  btnPlay.addEventListener('click', () => {
    try {
      const inst = caInst.getNew()
      const mml = inst ? caMML.get() : caMML.getNew()
      app.play(mml, inst)
    } catch (err: unknown) {
      if (err instanceof Error) {
        sidebar.log(err.message + '\n')
      } else {
        sidebar.log(err + '\n\n')
      }
    }
  })

  // add an event listener to the pause button
  const btnPause = getElementById<HTMLButtonElement>('pause')
  btnPause.addEventListener('click', () => app.pause())

  // add an event listener to the stop button
  const btnStop = getElementById<HTMLButtonElement>('stop')
  btnStop.addEventListener('click', () => app.stop())

  // build button
  const btnBuild = getElementById<HTMLButtonElement>('build')
  btnBuild.addEventListener('click', () => {
    try {
      app.build(caMML.get(), caInst.get())
    } catch (err: unknown) {
      if (err instanceof Error) {
        sidebar.log(err.message + '\n')
      } else {
        sidebar.log(err + '\n\n')
      }
    }
  })

  // info button
  const btnInfo = getElementById<HTMLButtonElement>('info')
  btnInfo.addEventListener('click', () => window.open('./docs/jp/about'))
})
