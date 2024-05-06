import {Lines} from './Lines'
import {Operator} from './Operator'

export class Operators {
  private readonly operators: Operator[]

  public constructor(lines: Lines, indent: number) {
    const operators = []
    while (true) {
      const line = lines.get()
      if (line === null || line.body.startsWith('@')) {
        break
      }
      operators.push(new Operator(lines, indent))
    }
    if (operators.length === 0) {
      const prev = lines.getPrevious()!
      throw new Error(
        `[syntax error] No operator is found at indentation level ${indent}: ${prev.ln} line."`
      )
    }
    this.operators = operators
  }

  public getRelease(): number {
    let maxRelease = 0
    for (const op of this.operators) {
      const release = op.getRelease()
      if (release > maxRelease) {
        maxRelease = release
      }
    }
    return maxRelease
  }

  public run(f: number, g: number, t: number): number {
    let p = 0
    for (const op of this.operators) {
      p += op.run(f, g, t)
    }
    return p
  }
}
