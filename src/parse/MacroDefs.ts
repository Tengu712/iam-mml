import type {Character} from './Character'

import {CommandsOnDemand} from '@/command/CommandsOnDemand'

export class MacroDefs {
  private map: Map<string, CommandsOnDemand>

  public constructor() {
    this.map = new Map()
  }

  public set(key: string, value: readonly Character[]): boolean {
    if (this.map.has(key)) {
      return false
    } else {
      this.map.set(key, new CommandsOnDemand(value))
      return true
    }
  }

  public get(key: string): CommandsOnDemand | null {
    return this.map.get(key) ?? null
  }
}
