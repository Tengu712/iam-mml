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
