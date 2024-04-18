import {PITCHES} from '../constants'
import type {Key} from '../parser/tokens/key'
import type {Buffer} from '../evaluator'

export function evaluateKey(key: Key, buffer: Buffer) {
  const shift = key.command === '+' ? 1 : key.command === '-' ? -1 : 0
  const arr = key.pitches.length === 0 ? PITCHES : key.pitches
  for (const n of arr) {
    buffer.shift.set(n, shift)
  }
}
