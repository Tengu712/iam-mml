import {checkCharsSame, type Character} from './Character'

import {InstOnDemand} from '@/inst/InstOnDemand'

export class InstDefs {
  private readonly charsMap: Map<string, readonly Character[]>
  private readonly map: Map<string, InstOnDemand>

  public constructor() {
    this.charsMap = new Map()
    this.map = new Map()
  }

  public set(key: string, value: readonly Character[]): boolean {
    if (this.map.has(key)) {
      return false
    } else {
      this.charsMap.set(key, value)
      this.map.set(key, new InstOnDemand(value))
      return true
    }
  }

  public get(key: string): InstOnDemand | null {
    return this.map.get(key) ?? null
  }

  public isSame(opponent: InstDefs): boolean {
    if (this.charsMap.size !== opponent.charsMap.size) {
      return false
    }
    for (const [key, value] of this.charsMap) {
      const opponentValue = opponent.charsMap.get(key)
      if (opponentValue === undefined) {
        return false
      }
      if (!checkCharsSame(value, opponentValue)) {
        return false
      }
    }
    return true
  }
}
