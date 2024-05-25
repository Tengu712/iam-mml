import {Operators} from './Operators'

import type {Characters} from '@/parse/Characters'

export class Inst {
  private readonly carrier: Operators
  private readonly release: number

  public constructor(chars: Characters) {
    this.carrier = new Operators(chars, 1)
    this.release = this.carrier.getRelease()
  }

  public getRelease(): number {
    return this.release
  }

  public run(f: number, g: number, t: number): number {
    return this.carrier.run(f, g, t)
  }
}
