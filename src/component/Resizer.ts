import {getElementById} from './getElement'

/**
 * A class for a resizer.
 */
export class Resizer {
  private readonly divResizer: HTMLDivElement
  private readonly divTarget: HTMLDivElement
  private readonly isLeftToShrink: boolean
  private start: number

  public constructor(divResizerId: string, divTargetId: string, isLeftToShrink: boolean) {
    this.divResizer = getElementById<HTMLDivElement>(divResizerId)
    this.divTarget = getElementById<HTMLDivElement>(divTargetId)
    this.isLeftToShrink = isLeftToShrink
    this.start = 0

    const onMouseUp = (event: MouseEvent) => {
      const k = this.isLeftToShrink ? 1 : -1
      this.divTarget.style.width = k * (event.x - this.start) + this.divTarget.clientWidth + 'px'
      document.removeEventListener('mouseup', onMouseUp)
    }
    const onMouseDown = (event: MouseEvent) => {
      this.start = event.x
      document.addEventListener('mouseup', onMouseUp)
    }
    this.divResizer.addEventListener('mousedown', onMouseDown)
  }
}
