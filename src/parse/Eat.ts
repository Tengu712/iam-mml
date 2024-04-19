import {Characters} from './Characters'

export class Eat {
  private constructor() {}

  public static spaces(chars: Characters): void {
    while (true) {
      const space = Eat.char(chars, [' ', '\t'])
      if (space === null) {
        break
      }
    }
  }

  public static char(chars: Characters, matches: readonly string[], ln?: number): string | null {
    const c = chars.get()
    if (c !== null && matches.includes(c.c) && (ln === undefined || ln === c.ln)) {
      chars.forward(1)
      return c.c
    } else {
      return null
    }
  }

  public static natural(chars: Characters, ln?: number): number | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    const fln = first.ln
    if (fln === null) {
      return null
    }
    if (ln !== undefined && fln !== ln) {
      return null
    }

    let buf = ''
    while (true) {
      const c = Eat.char(chars, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], fln)
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

  public static nnfloat(chars: Characters, ln?: number): number | null {
    const first = chars.get()
    if (first === null) {
      return null
    }

    const fln = first.ln
    if (fln === null) {
      return null
    }
    if (ln !== undefined && fln !== ln) {
      return null
    }

    const former = Eat.natural(chars)
    if (former === null) {
      return null
    }

    const dot = Eat.char(chars, ['.'], fln)
    if (dot === null) {
      return Number(former)
    }

    const latter = Eat.natural(chars, fln)
    if (latter === null) {
      throw new Error(
        `[ syntax error ] Invalid non-negative floating point number is found: ${first.ln} line, ${first.cn} char.`
      )
    }

    return Number('' + former + '.' + latter)
  }
}
