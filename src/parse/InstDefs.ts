import type {Character} from './Character'

import {InstOnDemand} from '@/inst/InstOnDemand'

export class InstDefs {
  private readonly map: Map<string, InstOnDemand>

  public constructor() {
    this.map = new Map()
  }

  public set(key: string, value: readonly Character[]): boolean {
    if (this.map.has(key)) {
      return false
    } else {
      this.map.set(key, new InstOnDemand(value))
      return true
    }
  }

  public get(key: string): InstOnDemand | null {
    return this.map.get(key) ?? null
  }
}
