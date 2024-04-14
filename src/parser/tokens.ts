import type {Character} from './lines'
import {eatSpaces} from './tokens/eat'
import {eatNote, type Note} from './tokens/note'
import {eatLength, type Length} from './tokens/length'
import {eatOctave, type Octave} from './tokens/octave'
import {eatVolume, type Volume} from './tokens/volume'

export type TokenID = 'Note' | 'Length' | 'Octave' | 'Volume'
export type Payload = Note | Length | Octave | Volume
export type Token = {
  id: TokenID
  payload: Payload
}

type EatFunction = (chars: Character[], i: number) => [Payload | null, number]
type Closure = (f: EatFunction, id: TokenID) => [Token, number] | null

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
  const startLn = chars[i].ln
  const startCn = chars[i].cn

  // skip spaces
  const i1 = eatSpaces(chars, i)

  // create closure
  const closure: Closure = (f, id) => {
    const [payload, newi] = f(chars, i1)
    if (payload !== null) {
      const token: Token = {
        id: id,
        payload: payload,
      }
      return [token, newi]
    } else {
      return null
    }
  }

  // note
  const note = closure(eatNote, 'Note')
  if (note !== null) {
    return note
  }
  // length
  const length = closure(eatLength, 'Length')
  if (length !== null) {
    return length
  }
  // octave
  const octave = closure(eatOctave, 'Octave')
  if (octave !== null) {
    return octave
  }
  // volume
  const volume = closure(eatVolume, 'Volume')
  if (volume !== null) {
    return volume
  }

  // error
  throw new Error(
    `[ syntax error ] Undefined token found: ${startLn} line, ${startCn} char.`
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
