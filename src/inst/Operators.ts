import {Operator} from './Operator'

import type {Characters} from '@/parse/Characters'

export class Operators {
  private readonly operators: Operator[]

  public constructor(chars: Characters, indent: number) {
    // get the line number for an error message
    const first = chars.get()
    if (first === null) {
      throw new Error(`[unexpected error] No operator found.`)
    }
    const ln = first.ln

    // parse operators
    const operators = []
    while (true) {
      if ((chars.get()?.cn ?? -1) !== indent) {
        break
      }
      operators.push(new Operator(chars, indent))
    }

    // check an error
    if (operators.length === 0) {
      throw new Error(
        `[syntax error] No operator is found at indentation level ${indent}: ${ln} line.`
      )
    }

    // finish
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
