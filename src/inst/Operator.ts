import {Operators} from './Operators'

import {PER_SAMPLE_RATE} from '@/constants'
import type {Characters} from '@/parse/Characters'

export class Operator {
  private readonly v: number
  private readonly f: number
  private readonly a: number
  private readonly d: number
  private readonly s: number
  private readonly r: number
  private readonly fbl: number
  private readonly modulator: Operators | null

  public constructor(chars: Characters, indent: number) {
    // get the line number for an error message
    const first = chars.get()
    if (first === null) {
      throw new Error(`[unexpected error] Tried to an inexistent operator.`)
    }
    const ln = first.ln

    // check an unexpected error
    if (first.cn !== indent) {
      throw new Error(
        `[unexpected error] The indent is expected ${indent} but found ${first.cn}: ${ln} line.`
      )
    }

    // define an closure to check
    const check = (s: string, n: number | null): number => {
      if (n === null) {
        throw new Error(`[syntax error] The operator parameter, ${s}, is not defined: ${ln} line.`)
      } else {
        return n
      }
    }

    // parse parameters
    chars.eatSpaces()
    this.v = check('volume', chars.eatNNFloat(ln))
    chars.eatSpaces()
    this.f = check('frequency', chars.eatNNFloat(ln))
    chars.eatSpaces()
    this.a = check('attack', chars.eatNNFloat(ln))
    chars.eatSpaces()
    this.d = check('decay', chars.eatNNFloat(ln))
    chars.eatSpaces()
    this.s = check('sustain', chars.eatNNFloat(ln))
    chars.eatSpaces()
    this.r = check('release', chars.eatNNFloat(ln))
    chars.eatSpaces()
    const fbl = chars.eatNNFloat(ln)
    if (fbl !== null) {
      this.fbl = fbl
    } else {
      this.fbl = 0
    }

    // set modulator null
    this.modulator = null

    // check the next line
    const next = chars.get()
    if (next === null) {
      return
    }
    if (next.ln === ln) {
      throw new Error(`[syntax error] Unexpected token is found: ${next.ln} line, ${next.cn} char.`)
    }

    // recurse
    if (next.cn > indent) {
      if (this.fbl > 0) {
        throw new Error(
          `[syntax error] The operator with feedback must be in the deepest indent: ${ln} line.`
        )
      }
      this.modulator = new Operators(chars, next.cn)
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
