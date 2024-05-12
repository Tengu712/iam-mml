import {PER_SAMPLE_RATE} from '../constants'
import {Lines} from './Lines'
import {Operators} from './Operators'

export class Operator {
  private readonly v: number
  private readonly f: number
  private readonly a: number
  private readonly d: number
  private readonly s: number
  private readonly r: number
  private readonly fbl: number
  private readonly modulator: Operators | null

  public constructor(lines: Lines, indent: number) {
    const line = lines.get()
    if (line === null) {
      throw new Error(`[unexpected error] Tried to an inexistent operator.`)
    }
    lines.forward()

    const params = line.body
      .trim()
      .split(' ')
      .map((n) => {
        if (Number.isNaN(n)) {
          throw new Error(
            `[syntax error] The operator parameter must be a number: ${line.ln} line.`
          )
        } else if (Number(n) < 0) {
          throw new Error(
            `[syntax error] The operator parameter must not be negative value: ${line.ln} line.`
          )
        } else {
          return Number(n)
        }
      })
    if (params.length > 7) {
      throw new Error(
        `[syntax error] The number of operator parameters is too many: ${line.ln} line.`
      )
    }
    if (params.length < 6) {
      throw new Error(
        `[syntax error] The number of operator parameters is too few: ${line.ln} line.`
      )
    }
    this.v = params[0]
    this.f = params[1]
    this.a = params[2]
    this.d = params[3]
    this.s = params[4]
    this.r = params[5]
    this.fbl = params.length === 7 ? Math.floor(params[6]) : 0

    this.modulator = null
    const nextLineIndent = lines.getIndent()
    if (nextLineIndent > indent) {
      if (this.fbl > 0) {
        throw new Error(
          `[syntax error] The operator with feedback must be in the deepest indent: ${line.ln} line.`
        )
      }
      this.modulator = new Operators(lines, nextLineIndent)
    }
  }

  public getRelease(): number {
    return this.r
  }

  public run(f: number, g: number, t: number): number {
    const i = t * PER_SAMPLE_RATE
    const j = g * PER_SAMPLE_RATE
    const m = this.modulator?.run(f, g, t) ?? 0
    let result = 0
    for (let fblc = 0; fblc < this.fbl + 1; ++fblc) {
      const base = this.v * Math.sin(2 * Math.PI * f * this.f * i + m + result)
      if (i < this.a) {
        result = (i / this.a) * base
      } else if (i < j && i < this.a + this.d) {
        result = (this.s + (1 - this.s) * (1 - (i - this.a) / this.d)) * base
      } else if (i < j) {
        result = this.s * base
      } else if (i < j + this.r) {
        result = this.s * (1 - (i - j) / this.r) * base
      }
    }
    return result
  }
}
