/* require parser/tokens/eat.js */
/* require parser/tokens/note.js */

/**
 * [PRIVATE]
 * A function to get a token.
 * 
 * @param {{c:string, ln:number, cn:number}[]} chars - the line of the part
 * @param {number} i - the current char index
 * @returns {[Object, number]} the token and the next index.
 * @throws an error if it cannot find any valid token.
 */
function getToken(chars, i) {
  if (i >= chars.length) {
    throw new Error(`[ syntax error ] Tried to get a token out of range.`)
  }
  const i0 = i
  // spaces
  const i1 = eatSpaces(chars, i0)
  // note
  const [note, i2] = eatNote(chars, i1)
  if (note !== null) {
    return [note, i2]
  }
  // error
  throw new Error(`[ syntax error ] Undefined token found: ${chars[i0].ln} line, ${chars[i0].cn} char.`)
}

/**
 * A function to parse into tokens per part.
 * 
 * @param {Map<string, {c:string, ln:number, cn:number}[]>} parts lines per part.
 * @returns {Map<string, Object[]>} tokens per part.
 * @throws an error if it cannot find any valid token.
 */
function getTokensPerPart(parts) {
  const tokensPerPart = new Map()
  for (const [partName, chars] of parts) {
    const tokens = []
    let i = 0
    while (i < chars.length) {
      const [token, newi] = getToken(chars, i)
      tokens.push(token)
      i = newi
    }
    tokensPerPart.set(partName, tokens)
  }
  return tokensPerPart
}
