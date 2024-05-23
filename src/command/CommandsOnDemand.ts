import {Commands} from './Commands'

import {Characters} from '@/parse/Characters'
import type {Character} from '@/parse/Character'

export class CommandsOnDemand {
  private readonly chars: readonly Character[]
  private commands: Commands | null

  public constructor(chars: readonly Character[]) {
    this.chars = chars
    this.commands = null
  }

  public get(): Commands {
    if (this.commands === null) {
      this.commands = new Commands(new Characters(this.chars))
    }
    return this.commands
  }
}
