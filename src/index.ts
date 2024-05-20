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

  // add an event listener to the import button
  const btnImport = getElementById<HTMLButtonElement>('import')
  btnImport.addEventListener('click', () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'text/*'
    input.onchange = () => {
      if (input.files === null || input.files.length === 0) {
        return
      }
      const fileReader = new FileReader()
      fileReader.onload = () => {
        if (fileReader.result === null) {
          sidebar.log(`[io error] Failed to read the imported file.`)
          return
        }
        const result = fileReader.result.toString()
        const index = result.indexOf('\n%%\n')
        if (index < 0) {
          sidebar.log(`[io error] Invalid MML is imported.`)
          return
        }
        const inst = result.slice(0, index)
        const mml = result.slice(index + 4)
        caInst.set(inst)
        caMML.set(mml)
      }
      fileReader.readAsText(input.files[0])
    }
    input.click()
  })

  // add an event listener to the export button
  const btnExport = getElementById<HTMLButtonElement>('export')
  btnExport.addEventListener('click', () => {
    const text = caInst.getRaw() + '\n\n%%\n' + caMML.getRaw() + '\n'
    const a = document.createElement('a')
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    a.download = 'music.mml'
    a.click()
  })

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
