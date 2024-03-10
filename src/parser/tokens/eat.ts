import type {Character} from '../lines'

/**
 * A function to eat one character if chars matches matches.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @param matches - characters to check match
 * @returns the matched character and the next index.
 */
export function eatChar(
  chars: Character[],
  i: number,
  matches: string[]
): [string | null, number] {
  if (i < chars.length && matches.includes(chars[i].c)) {
    return [chars[i].c, i + 1]
  } else {
    return [null, i]
  }
}

/**
 * A function to eat spaces.
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
 * A function to eat an integer.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the eaten integer and the next index.
 */
export function eatInteger(
  chars: Character[],
  i: number
): [number | null, number] {
  let buf = ''
  while (i < chars.length) {
    const [c, newi] = eatChar(chars, i, [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ])
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
