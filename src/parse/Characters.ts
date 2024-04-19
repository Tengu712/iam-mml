import type {Character} from './Character'

export class Characters {
  private index: number
  private readonly chars: readonly Character[]

  public constructor(chars: readonly Character[]) {
    this.index = 0
    this.chars = chars
  }

  public get(): Character | null {
    if (this.index < this.chars.length) {
      return this.chars[this.index]
    } else {
      return null
    }
  }

  public forward(count: number) {
    this.index += count
  }

  public back(count: number) {
    this.index -= count
    if (this.index < 0) {
      this.index = 0
    }
  }
}
