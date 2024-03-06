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

/**
 * A function to eat one character if chars matches matches.
 * [
 *   string|null, // matched character
 *   number,      // next index
 * ]
 */
function eatChar(chars, i, matches) {
  if (i < chars.length && matches.includes(chars[i].c)) {
    return [chars[i].c, i + 1]
  } else {
    return [null, i]
  }
}

/**
 * A function to eat an integer.
 * [
 *   number|null, // eatern integer
 *   number,      // next index
 * ]
 */
function eatInteger(chars, i) {
  let buf = ""
  while (i < chars.length) {
    const [c, newi] = eatChar(chars, i, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])
    if (c === null) {
      break
    }
    buf += c
    i = newi
  }
  if (buf === "") {
    return [null, i]
  } else {
    return [Number(buf), i]
  }
}

/**
 * A function to eat a note.
 * [
 *   Note {
 *     type: string,       // the object type tag
 *     startLn: number,    // the token start line number
 *     startCn: number,    // the token start char number
 *     scale: string,      // the musical scale
 *     accidental: string, // the accidental
 *     noteValue: number,  // the note value
 *     dot: boolean,       // is the note dotted
 *   }|null, // eaten note
 *   number, // next index
 * ]
 */
function eatNote(chars, i) {
  switch (chars[i].c) {
    case "a":
    case "b":
    case "c":
    case "d":
    case "e":
    case "f":
    case "g":
    case "r":
      break
    default:
      return [null, i]
  }
  const i0 = i
  const [scale, i1] = [chars[i0].c, i0 + 1]
  const [accidental, i2] = eatChar(chars, i1, ["+", "-", "="])
  const [noteValue, i3] = eatInteger(chars, i2)
  const [dot, i4] = eatChar(chars, i3, ["."])
  const note = {
    type: "note",
    startLn: chars[i0].ln,
    startCn: chars[i0].cn,
    scale: scale,
    accidental: accidental,
    noteValue: noteValue,
    dot: dot !== null,
  }
  return [note, i4]
}

/**
 * A function to get a token.
 * [
 *   Note,   // token
 *   number, // next index
 * ]
 * If it cannot find any valid token, it throws an error.
 */
function getToken(chars, i) {
  if (i >= chars.length) {
    throw new Error(`[ syntax error ] Tried to get a token out of range.`)
  }
  const i0 = i
  // note
  const [note, i1] = eatNote(chars, i0)
  if (note !== null) {
    return [note, i1]
  }
  // error
  throw new Error(`[ syntax error ] Undefined token found: ${chars[i0].ln} line, ${chars[i0].cn} char.`)
}

/**
 * A function to parse into tokens per part.
 * Map<
 *   string, // the name of the part
 *   Token[] // the tokens of the part
 * >
 * If it cannot find any valid token, it throws an error.
 */
function getPartsTokens(parts) {
  const partsTokens = new Map()
  for (const [partName, chars] of parts) {
    const tokens = []
    let i = 0
    while (i < chars.length) {
      const [token, newi] = getToken(chars, i)
      tokens.push(token)
      i = newi
    }
    partsTokens.set(partName, tokens)
  }
  return partsTokens
}

function parseMML(mml) {
  const lines = getLines(mml)
  const parts = getParts(lines)
  const partsTokens = getPartsTokens(parts)
  console.log(partsTokens)
}
