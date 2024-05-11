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
    if (params.length > 6) {
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

    this.modulator = null
    const nextLineIndent = lines.getIndent()
    if (nextLineIndent > indent) {
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
    const base = this.v * Math.sin(2 * Math.PI * f * this.f * i + m)
    if (i < this.a) {
      return (i / this.a) * base
    }
    if (i < j && i < this.a + this.d) {
      return (this.s + (1 - this.s) * (1 - (i - this.a) / this.d)) * base
    }
    if (i < j) {
      return this.s * base
    }
    if (i < j + this.r) {
      return this.s * (1 - (i - j) / this.r) * base
    }
    return 0
  }
}
