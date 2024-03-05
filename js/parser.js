/**
 * A function to get lines with each character position.
 * - no head spaces
 * - no tail spaces
 * - no comments
 * - no empty line
 * Char {
 *   c: string, // character
 *   ln: number, // line number in the text
 *   cn: number, // character number in the line
 * }[][]
 */
function getLines(text) {
  // split into lines
  const splitted = text.replace(/\r\n|\r/g, "\n").split("\n")
  // for lines
  const lines = []
  for (let ln = 0; ln < splitted.length; ++ln) {
    // remove tail spaces
    const line = splitted[ln].trimEnd()
    // skip head spaces
    let cn = 0
    for (; cn < line.length; ++cn) {
      if (line[cn] !== " ") {
        break
      }
    }
    // for chars
    const chars = []
    for (; cn < line.length; ++cn) {
      if (line[cn] === ";") {
        break
      }
      chars.push({ c: line[cn], ln: ln + 1, cn: cn + 1 })
    }
    // push a line
    if (chars.length > 0) {
      lines.push(chars)
    }
  }
  return lines
}

/**
 * A function to get the part name of the line.
 * PartName {
 *   name: string, // the part name of the line
 *   next: number, // the start index of the body of the line
 * }
 * If the line has only a part name, it throws an error.
 */
function getPartName(chars) {
  for (let i = 0; i < chars.length; ++i) {
    if (chars[i].c === " ") {
      let name = ""
      for (let j = 0; j < i; ++j) {
        name += chars[j].c
      }
      return { name: name, next: i + 1 }
    }
  }
  throw new Error(`[ syntax error ] The ${chars[0].ln}th line consists only of part names.`)
}

/**
 * A function to consolidate lines by parts.
 * Map<
 *   string, // the name of the part
 *   Char[] // the body of the part
 * >
 * If there's a line that has only a part name, it throws an error.
 */
function getParts(lines) {
  const parts = new Map()
  for (const chars of lines) {
    const partName = getPartName(chars)
    if (!parts.has(partName.name)) {
      parts.set(partName.name, [])
    }
    const current = parts.get(partName.name)
    parts.set(partName.name, current.concat(chars.slice(partName.next)))
  }
  return parts
}

function parseMML(mml) {
  const lines = getLines(mml)
  const parts = getParts(lines)
  console.log(parts)
}
