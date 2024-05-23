import {getElementById} from './getElement'

/**
 * A class for a IAM.mml codearea.
 *
 * The textarea for line numbers must be readonly.
 * It make the scroll of the textarea for line numbers be synchronized with that of the main textarea.
 */
export class Codearea {
  private readonly ta: HTMLTextAreaElement
  private readonly taNumbers: HTMLTextAreaElement
  private isReaded: boolean

  public constructor(taId: string, taNumbersId: string) {
    this.ta = getElementById<HTMLTextAreaElement>(taId)
    this.taNumbers = getElementById<HTMLTextAreaElement>(taNumbersId)
    this.isReaded = false

    this.taNumbers.value = '1\n'

    this.ta.addEventListener('input', () => this.update())
    this.ta.addEventListener('scroll', () => (this.taNumbers.scrollTop = this.ta.scrollTop))
  }

  private update() {
    const linesCount = this.ta.value.split('\n').length
    let taNumbersValue = ''
    for (let i = 1; i < linesCount + 1; ++i) {
      taNumbersValue += i + '\n'
    }
    this.taNumbers.value = taNumbersValue
    this.taNumbers.scrollTop = this.ta.scrollTop
    this.isReaded = false
  }

  public get(): string {
    this.isReaded = true
    return this.ta.value
  }

  public getRaw(): string {
    return this.ta.value
  }

  public getIsReaded(): boolean {
    return this.isReaded
  }

  public set(value: string) {
    this.isReaded = false
    this.ta.value = value
    this.update()
  }
}
