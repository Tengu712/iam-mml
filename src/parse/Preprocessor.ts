import {convertStringToCharacters} from './Character'
import {MacroDefs} from './MacroDefs'
import {PartDefs} from './PartDefs'

export class Preprocessor {
  private readonly partDefs: PartDefs
  private readonly macroDefs: MacroDefs

  public constructor(code: string) {
    const lines = code
      .replace(/\r\n|\r/g, '\n')
      .replace(/;.*?\n/g, '\n')
      .replace(/( |\t)+?\n/g, '\n')
      .split('\n')

    this.partDefs = new PartDefs()
    this.macroDefs = new MacroDefs()

    for (let ln = 0; ln < lines.length; ++ln) {
      const line = lines[ln]
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
        const setResult = this.macroDefs.set(macroName, macroChars)
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
      this.partDefs.set(partName, partChars)
    }
  }

  public getPartDefs(): PartDefs {
    return this.partDefs
  }

  public getMacroDefs(): MacroDefs {
    return this.macroDefs
  }
}
