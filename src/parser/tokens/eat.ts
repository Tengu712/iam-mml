import type {Character} from '../lines'

/**
 * A function to eat one character if chars matches matches.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @param matches - characters to check match
 * @returns the matched character and the next index.
 */
export function eatChar(chars: Character[], i: number, matches: string[]): [string | null, number] {
  if (i < chars.length && matches.includes(chars[i].c)) {
    return [chars[i].c, i + 1]
  } else {
    return [null, i]
  }
}

/**
 * A function to eat spaces or tabs.
 *
 * @param  chars - the line of the part
 * @param i - the current char index
 * @returns the next index.
 */
export function eatSpaces(chars: Character[], i: number): number {
  while (i < chars.length) {
    const [space, newi] = eatChar(chars, i, [' ', '\t'])
    if (space === null) {
      return i
    }
    i = newi
  }
  return i
}

/**
 * A function to eat an integer on the same line.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the eaten integer and the next index.
 */
export function eatNaturalNumber(chars: Character[], i: number): [number | null, number] {
  if (i >= chars.length) {
    return [null, i]
  }
  const ln = chars[i].ln
  let buf = ''
  while (i < chars.length && chars[i].ln === ln) {
    const [c, newi] = eatChar(chars, i, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
    if (c === null) {
      break
    }
    buf += c
    i = newi
  }
  if (buf === '') {
    return [null, i]
  } else {
    return [Number(buf), i]
  }
}

/**
 * A function to eat an integer on the same line.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the eaten integer and the next index.
 */
export function eatFloatingPointNumber(chars: Character[], i: number): [number | null, number] {
  if (i >= chars.length) {
    return [null, i]
  }
  const [former, i1] = eatNaturalNumber(chars, i)
  const [dot, i2] = eatChar(chars, i1, ['.'])
  const [latter, i3] = eatNaturalNumber(chars, i2)
  if (
    former !== null &&
    dot !== null &&
    latter !== null &&
    chars[i].ln === chars[i1].ln &&
    chars[i].ln === chars[i2].ln
  ) {
    const s = '' + former + '.' + latter
    const n = Number(s)
    return [n, i3]
  }
  if (former !== null) {
    return [Number(former), i1]
  }
  return [null, i]
}
