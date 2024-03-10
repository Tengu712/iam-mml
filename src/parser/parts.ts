import type {Character} from './lines'

/**
 * A function to get the part name of the line.
 *
 * @param chars - the line
 * @returns the part name of the line and the start index of the body of the line.
 * @throws an error if the line has only a part name.
 */
function getPartName(chars: Character[]): {name: string; next: number} {
  for (let i = 0; i < chars.length; ++i) {
    if (chars[i].c === ' ') {
      let name = ''
      for (let j = 0; j < i; ++j) {
        name += chars[j].c
      }
      return {name: name, next: i + 1}
    }
  }
  throw new Error(
    `[ syntax error ] The ${chars[0].ln}th line consists only of part names.`
  )
}

/**
 * A function to consolidate lines by parts.
 *
 * @param lines - the lines of MML
 * @returns lines per part.
 * @throws an error if there's a line that has only a part name.
 */
export function getParts(lines: Character[][]): Map<string, Character[]> {
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
