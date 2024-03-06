/* require parser/lines.js */
/* require parser/parts.js */
/* require parser/tokens.js */

function parseMML(mml) {
  const lines = getLines(mml)
  const parts = getParts(lines)
  const tokensPerPart = getTokensPerPart(parts)
  return tokensPerPart
}
