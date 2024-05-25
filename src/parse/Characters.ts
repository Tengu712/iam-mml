import type {Character} from './Character'

export class Characters {
  private index: number
  private readonly chars: readonly Character[]

  public constructor(chars: readonly Character[]) {
    this.index = 0
    this.chars = chars
  }

  public get(): Character | null {
    if (this.index < this.chars.length) {
      return this.chars[this.index]
    } else {
      return null
    }
  }

  public getAll(): readonly Character[] {
    return this.chars
  }

  public forward(count: number) {
    this.index += count
  }

  public back(count: number) {
    this.index -= count
    if (this.index < 0) {
      this.index = 0
    }
  }

  public eatSpaces(): void {
    while (true) {
      const space = this.eatChar([' ', '\t'])
      if (space === null) {
        break
      }
    }
  }

  public eatChar(matches: readonly string[], ln?: number): string | null {
    const c = this.get()
    if (c !== null && matches.includes(c.c) && (ln === undefined || ln === c.ln)) {
      this.forward(1)
      return c.c
    } else {
      return null
    }
  }

  public eatNatural(ln?: number): number | null {
    const first = this.get()
    if (first === null) {
      return null
    }

    const fln = first.ln
    if (ln !== undefined && fln !== ln) {
      return null
    }

    let buf = ''
    while (true) {
      const c = this.eatChar(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], fln)
      if (c === null) {
        break
      }
      buf += c
    }

    if (buf.length > 0) {
      return Number(buf)
    } else {
      return null
    }
  }

  public eatNNFloat(ln?: number): number | null {
    const first = this.get()
    if (first === null) {
      return null
    }

    const fln = first.ln
    if (ln !== undefined && fln !== ln) {
      return null
    }

    const former = this.eatNatural()
    if (former === null) {
      return null
    }

    const dot = this.eatChar(['.'], fln)
    if (dot === null) {
      return Number(former)
    }

    const latter = this.eatNatural(fln)
    if (latter === null) {
      throw new Error(
        `[syntax error] Invalid non-negative floating point number is found: ${first.ln} line, ${first.cn} eatChar.`
      )
    }

    return Number('' + former + '.' + latter)
  }

  public eatIdentifier(ln?: number): string | null {
    const first = this.get()
    if (first === null) {
      return null
    }

    const fln = first.ln
    if (ln !== undefined && fln !== ln) {
      return null
    }

    let s = ''
    while (true) {
      const c = this.get()
      if (c === null || c.ln !== fln || c.c === ' ' || c.c === '\t') {
        break
      }
      s += c.c
      this.forward(1)
    }
    if (s.length > 0) {
      return s
    } else {
      return null
    }
  }
}
