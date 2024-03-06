/* require parser/tokens/eat.js */

/**
 * A function to eat a note.
 * 
 * @param {{c:string, ln:number, cn:number}[]} chars - the line of the part
 * @param {number} i - the current char index
 * @returns {[{type:string, startLn:number, startCn:number, scale:string, accidental:string, noteValue:number, dotted:boolean}|null, number]} the eaten note and the next index.
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
    dotted: dot !== null,
  }
  return [note, i4]
}
