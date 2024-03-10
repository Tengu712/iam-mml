import type {Token} from './parser/tokens'
import {getLines} from './parser/lines'
import {getParts} from './parser/parts'
import {getTokensPerPart} from './parser/tokens'

export function parseMML(mml: string): Map<string, Token[]> {
  const lines = getLines(mml)
  const parts = getParts(lines)
  const tokensPerPart = getTokensPerPart(parts)
  return tokensPerPart
}
