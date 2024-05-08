import {getElementById} from './getElement'

/**
 * A class for the sidebar component.
 *
 * It gets the div components which have the following ids:
 * - blinder
 * - sidebar
 * - sidebar-button
 * - sidebar-button-icon
 * - log
 *
 * It switches the icon of sidebar-button-icon by switching its classname:
 * - left-triangle
 * - right-triangle
 */
export class Sidebar {
  private readonly divBlinder: HTMLDivElement
  private readonly divSidebar: HTMLDivElement
  private readonly divSidebarButtonIcon: HTMLDivElement
  private readonly taLog: HTMLTextAreaElement
  private isOpened: boolean

  public constructor() {
    this.divBlinder = getElementById<HTMLDivElement>('blinder')
    this.divSidebar = getElementById<HTMLDivElement>('sidebar')
    this.divSidebarButtonIcon = getElementById<HTMLDivElement>('sidebar-button-icon')
    this.taLog = getElementById<HTMLTextAreaElement>('log')
    this.isOpened = false

    this.divBlinder.addEventListener('click', () => this.close())

    const divSidebarButton = getElementById<HTMLDivElement>('sidebar-button')
    divSidebarButton.addEventListener('click', () => (this.isOpened ? this.close() : this.open()))
  }

  private open() {
    this.divBlinder.style.display = 'block'
    this.divSidebar.style.display = 'flex'
    this.divSidebarButtonIcon.classList.remove('left-triangle')
    this.divSidebarButtonIcon.classList.add('right-triangle')
    this.isOpened = true
  }

  private close() {
    this.divBlinder.style.display = 'none'
    this.divSidebar.style.display = 'none'
    this.divSidebarButtonIcon.classList.remove('right-triangle')
    this.divSidebarButtonIcon.classList.add('left-triangle')
    this.isOpened = false
  }

  public log(message: string) {
    const hhmmss = (date: Date): string =>
      ('0' + date.getHours()).slice(-2) +
      ':' +
      ('0' + date.getMinutes()).slice(-2) +
      ':' +
      ('0' + date.getSeconds()).slice(-2)
    this.taLog.value += '('
    this.taLog.value += hhmmss(new Date())
    this.taLog.value += ') '
    this.taLog.value += message
  }
}
