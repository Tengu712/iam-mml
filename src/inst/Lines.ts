import type {Line} from './Line'

export class Lines {
  private readonly lines: Line[]
  private idx: number

  public constructor(text: string) {
    this.lines = text
      .replace(/\r\n|\r/g, '\n')
      .split('\n')
      .map((n, i) => {
        return {ln: i + 1, body: n.trimEnd()}
      })
      .filter((n) => n.body.length > 0)
    this.idx = 0
  }

  public get(): Line | null {
    if (this.idx < this.lines.length) {
      return this.lines[this.idx]
    } else {
      return null
    }
  }

  public getPrevious(): Line | null {
    if (this.idx - 1 < this.lines.length) {
      return this.lines[this.idx - 1]
    } else {
      return null
    }
  }

  public forward() {
    this.idx += 1
  }
}
