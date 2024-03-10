import type {Character} from './lines'
import {eatSpaces} from './tokens/eat'
import {eatNote, type Note} from './tokens/note'

export type TokenID = 'Note'
export type Token = {
  id: TokenID
  value: Note
}

/**
 * A function to get a token.
 *
 * @param chars - the line of the part
 * @param i - the current char index
 * @returns the token and the next index.
 * @throws an error if it cannot find any valid token.
 */
function getToken(chars: Character[], i: number): [Token, number] {
  if (i >= chars.length) {
    throw new Error(`[ syntax error ] Tried to get a token out of range.`)
  }
  const i0 = i
  // spaces
  const i1 = eatSpaces(chars, i0)
  // note
  const [note, i2] = eatNote(chars, i1)
  if (note !== null) {
    const token: Token = {
      id: 'Note',
      value: note,
    }
    return [token, i2]
  }
  // error
  throw new Error(
    `[ syntax error ] Undefined token found: ${chars[i0].ln} line, ${chars[i0].cn} char.`
  )
}

/**
 * A function to parse into tokens per part.
 *
 * @param parts lines per part.
 * @returns tokens per part.
 * @throws an error if it cannot find any valid token.
 */
export function getTokensPerPart(
  parts: Map<string, Character[]>
): Map<string, Token[]> {
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
