import {Commands} from './Commands'

import {Characters} from '@/parse/Characters'
import type {Character} from '@/parse/Character'
import type {MacroDefs} from '@/parse/MacroDefs'
import type {Insts} from '@/inst/Insts'

export class CommandsOnDemand {
  private readonly chars: readonly Character[]
  private commands: Commands | null

  public constructor(chars: readonly Character[]) {
    this.chars = chars
    this.commands = null
  }

  public get(macroDefs: MacroDefs, instDefs: Insts): Commands {
    if (this.commands === null) {
      this.commands = new Commands(new Characters(this.chars), macroDefs, instDefs)
    }
    return this.commands
  }
}
