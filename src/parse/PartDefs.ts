import type {Character} from './Character'

export class PartDefs {
  private map: Map<string, readonly Character[]>

  public constructor() {
    this.map = new Map()
  }

  public set(key: string, value: readonly Character[]) {
    if (this.map.has(key)) {
      this.map.set(key, this.map.get(key)!.concat(value))
    } else {
      this.map.set(key, value)
    }
  }

  public get(key: string): readonly Character[] | null {
    return this.map.get(key) ?? null
  }

  public iter(): IterableIterator<[string, readonly Character[]]> {
    return this.map.entries()
  }

  public len(): number {
    return this.map.size
  }

  public clear() {
    this.map.clear()
  }
}
