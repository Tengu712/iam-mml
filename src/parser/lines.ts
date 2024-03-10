export type Character = {
  c: string // the character
  ln: number // the line number at the MML
  cn: number // the char number at the line
}

/**
 * A function to split into lines with each character position.
 *
 * - no head spaces
 * - no tail spaces
 * - no comments
 * - no empty line
 *
 * @param mml - MML text
 * @returns lines with each character position.
 */
export function getLines(mml: string): Character[][] {
  // split into lines
  const splitted = mml.replace(/\r\n|\r/g, '\n').split('\n')
  // for lines
  const lines = []
  for (let ln = 0; ln < splitted.length; ++ln) {
    // remove tail spaces
    const line = splitted[ln].trimEnd()
    // skip head spaces
    let cn = 0
    for (; cn < line.length; ++cn) {
      if (line[cn] !== ' ') {
        break
      }
    }
    // for chars
    const chars = []
    for (; cn < line.length; ++cn) {
      if (line[cn] === ';') {
        break
      }
      chars.push({c: line[cn], ln: ln + 1, cn: cn + 1})
    }
    // push a line
    if (chars.length > 0) {
      lines.push(chars)
    }
  }
  return lines
}
