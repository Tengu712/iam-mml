import {describe, expect, test} from 'bun:test'
import {eatLength, type Length} from './length'

describe('eatLength', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = [
      {c: 'l', ln: 1, cn: 1},
      {c: '4', ln: 1, cn: 2},
    ]
    const i = 2
    const expected: [Length | null, number] = [null, i]
    expect(eatLength(chars, i)).toStrictEqual(expected)
  })

  test('When no Length is found, it returns null and the current index.', () => {
    const chars = [
      {c: 'l', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: '4', ln: 1, cn: 3},
    ]
    const i = 1
    const expected: [Length | null, number] = [null, i]
    expect(eatLength(chars, i)).toStrictEqual(expected)
  })

  test('When the Length number is not found on the same line, it throws an error.', () => {
    const chars = [
      {c: 'l', ln: 1, cn: 1},
      {c: '4', ln: 2, cn: 1},
    ]
    const i = 0
    expect(() => eatLength(chars, i)).toThrow()
  })

  test('When the Length number is not found, it throws an error.', () => {
    const chars = [
      {c: 'l', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
    ]
    const i = 0
    expect(() => eatLength(chars, i)).toThrow()
  })

  test('When the Length number is 0, it throws an error.', () => {
    const chars = [
      {c: 'l', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
    ]
    const i = 0
    expect(() => eatLength(chars, i)).toThrow()
  })

  test('When an Length is found, it returns Length and the next index.', () => {
    const chars = [
      {c: 'l', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '6', ln: 1, cn: 3},
    ]
    const i = 0
    const expectedLength: Length = {
      startLn: 1,
      startCn: 1,
      noteValue: 16,
    }
    const expected: [Length | null, number] = [expectedLength, i + 3]
    expect(eatLength(chars, i)).toStrictEqual(expected)
  })
})
