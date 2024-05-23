import {convertStringToCharacters, type Character} from './Character'
import {MacroDefs} from './MacroDefs'
import {PartDefs} from './PartDefs'
import {InstDefs} from './InstDefs'

/**
 * A class for functions that generate PartDefs, MacroDefs, and InstDefs
 * from part definitions and instrument definitions.
 */
export class Parser {
  private constructor() {}

  public static parse(mml: string, insts: string): [PartDefs, MacroDefs, InstDefs] {
    const partDefs = new PartDefs()
    const macroDefs = new MacroDefs()
    const instDefs = new InstDefs()

    // part definition

    const mmlLines = mml
      .replace(/\r\n|\r/g, '\n')
      .replace(/;.*?\n/g, '\n')
      .replace(/( |\t)+?\n/g, '\n')
      .split('\n')
    for (let ln = 0; ln < mmlLines.length; ++ln) {
      const line = mmlLines[ln]
      let cn = 0

      // skip head spaces and tabs
      for (; cn < line.length; ++cn) {
        if (line[cn] !== ' ' && line[cn] !== '\t') {
          break
        }
      }

      // is it a white spaces line?
      if (cn >= line.length) {
        continue
      }

      // is it a macro definition line?
      if (line[cn] === '!') {
        let macroName = ''
        for (++cn; cn < line.length; ++cn) {
          if (line[cn] === ' ' || line[cn] === '\t') {
            break
          }
          macroName += line[cn]
        }
        if (macroName.length === 0) {
          throw new Error(`[syntax error] Macro line doesn't have name: ${ln} line.`)
        }
        const macroChars = convertStringToCharacters(line, ln, cn)
        const setResult = macroDefs.set(macroName, macroChars)
        if (!setResult) {
          throw new Error(
            `[syntax error] The macro '${macroName}' has been already defined: ${ln} line.`
          )
        }
        continue
      }

      // is it a part definition line?
      let partName = ''
      for (; cn < line.length; ++cn) {
        if (line[cn] === ' ' || line[cn] === '\t') {
          break
        }
        partName += line[cn]
      }
      const partChars = convertStringToCharacters(line, ln, cn)
      partDefs.set(partName, partChars)
    }

    // instruments definitions

    const instsLines = insts
      .replace(/\r\n|\r/g, '\n')
      .replace(/;.*?\n/g, '\n')
      .replace(/( |\t)+?\n/g, '\n')
      .split('\n')

    let instLn = 1
    let instName = ''
    let instChars: Character[] = []
    const set = () => {
      if (instName.length === 0) {
        return
      }
      if (instChars.length === 0) {
        throw new Error(
          `[syntax error] Every instrument must have at least one operator: ${instLn} line.`
        )
      }
      if (!instDefs.set(instName, instChars)) {
        throw new Error(
          `[syntax error] The instrument '${instName}' is already defined: ${instLn} line.`
        )
      }
    }

    for (let ln = 0; ln < instsLines.length; ++ln) {
      const line = instsLines[ln]
      let cn = 0

      // skip a white spaces line
      if (line.length === 0) {
        continue
      }

      // is it a instrument name definition line?
      if (line[cn] === '@') {
        // set
        set()
        // update
        instLn = ln + 1
        instName = line.slice(cn)
        instChars = []
        continue
      }

      // skip head spaces and tabs
      for (; cn < line.length; ++cn) {
        if (line[cn] !== ' ' && line[cn] !== '\t') {
          break
        }
      }

      // check a syntax error
      if (instName.length === 0) {
        throw new Error(`[syntax error] No instrument name has been defined: ${instLn} line.`)
      }

      // push
      instChars = instChars.concat(convertStringToCharacters(line, ln, cn))
    }
    set()

    return [partDefs, macroDefs, instDefs]
  }
}
