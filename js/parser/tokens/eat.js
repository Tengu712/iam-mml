/**
 * A function to eat one character if chars matches matches.
 * 
 * @param {{c:string, ln:number, cn:number}[]} chars - the line of the part
 * @param {number} i - the current char index
 * @param {string[]} matches - characters to check match
 * @returns {[string|null, number]} the matched character and the next index.
 */
function eatChar(chars, i, matches) {
  if (i < chars.length && matches.includes(chars[i].c)) {
    return [chars[i].c, i + 1]
  } else {
    return [null, i]
  }
}

/**
 * A function to eat spaces.
 * 
 * @param {{c:string, ln:number, cn:number}[]} chars - the line of the part
 * @param {number} i - the current char index
 * @returns {number} the next index.
 */
function eatSpaces(chars, i) {
  while (i < chars.length) {
    const [space, newi] = eatChar(chars, i, [" ", "\t"])
    if (space === null) {
      return i
    }
    i = newi
  }
}

/**
 * A function to eat an integer.
 * 
 * @param {{c:string, ln:number, cn:number}[]} chars - the line of the part
 * @param {number} i - the current char index
 * @returns {[number|null, number]} the eaten integer and the next index.
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
