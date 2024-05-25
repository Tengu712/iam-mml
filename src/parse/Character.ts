export type Character = {
  c: string
  ln: number
  cn: number
}

/**
 * A function to convert a string to a Character array.
 * The line and column numbers start from 1.
 *
 * @param line The entire string of one line
 * @param ln Line number starting from 0
 * @param cn Column number starting from 0
 * @returns a converted character array.
 */
export function convertStringToCharacters(line: string, ln: number, cn: number): Character[] {
  const chars = []
  for (; cn < line.length; ++cn) {
    chars.push({c: line[cn], ln: ln + 1, cn: cn + 1})
  }
  return chars
}

/**
 * A function to check if the contents of two given Character arrays are the same.
 *
 * @param a
 * @param b
 * @returns true if both are the same.
 */
export function checkCharsSame(a: readonly Character[], b: readonly Character[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    return false
  }
  return true
}
