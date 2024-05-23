import {Inst} from './Inst'

import {Characters} from '@/parse/Characters'
import type {Character} from '@/parse/Character'

export class InstOnDemand {
  private readonly chars: readonly Character[]
  private inst: Inst | null

  public constructor(chars: readonly Character[]) {
    this.chars = chars
    this.inst = null
  }

  public get(): Inst {
    if (this.inst === null) {
      this.inst = new Inst(new Characters(this.chars))
    }
    return this.inst
  }
}
