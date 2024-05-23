import type {Character} from './Character'

import {CommandsOnDemand} from '@/command/CommandsOnDemand'

export class MacroDefs {
  private readonly charsMap: Map<string, readonly Character[]>
  private readonly map: Map<string, CommandsOnDemand>

  public constructor() {
    this.charsMap = new Map()
    this.map = new Map()
  }

  public set(key: string, value: readonly Character[]): boolean {
    if (this.map.has(key)) {
      return false
    } else {
      this.charsMap.set(key, value)
      this.map.set(key, new CommandsOnDemand(value))
      return true
    }
  }

  public get(key: string): CommandsOnDemand | null {
    return this.map.get(key) ?? null
  }
}
