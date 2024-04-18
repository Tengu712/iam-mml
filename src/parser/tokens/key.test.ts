import {describe, expect, test} from 'bun:test'
import {eatKey, type Key} from './key'

describe('eatKey', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = [
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '+', ln: 1, cn: 3},
    ]
    const i = 3
    const expected: [Key | null, number] = [null, i]
    expect(eatKey(chars, i)).toStrictEqual(expected)
  })

  test('When no key is found, it returns null and the current index.', () => {
    const chars = [
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '+', ln: 1, cn: 3},
    ]
    const i = 1
    const expected: [Key | null, number] = [null, i]
    expect(eatKey(chars, i)).toStrictEqual(expected)
  })

  test('When the command is not found, it throws an error.', () => {
    const chars = [
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
    ]
    const i = 0
    expect(() => eatKey(chars, i)).toThrow()
  })

  test('When the command is not found on the same line, it throws an error.', () => {
    const chars = [
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '+', ln: 2, cn: 1},
    ]
    const i = 0
    expect(() => eatKey(chars, i)).toThrow()
  })

  test('When it is in the middle, it throws an error.', () => {
    const chars = [
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: 'b', ln: 1, cn: 3},
      {c: 'c', ln: 2, cn: 1},
      {c: '+', ln: 2, cn: 2},
    ]
    const i = 0
    expect(() => eatKey(chars, i)).toThrow()
  })

  test('When "k+" is found, it returns Key and the next index.', () => {
    const chars = [
      {c: 'k', ln: 1, cn: 1},
      {c: '+', ln: 1, cn: 2},
    ]
    const i = 0
    const expectedKey: Key = {
      startLn: 1,
      startCn: 1,
      command: '+',
      pitches: [],
    }
    const expected: [Key | null, number] = [expectedKey, i + 2]
    expect(eatKey(chars, i)).toStrictEqual(expected)
  })

  test('When "ka-" is found, it returns Key and the next index.', () => {
    const chars = [
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '-', ln: 1, cn: 3},
    ]
    const i = 0
    const expectedKey: Key = {
      startLn: 1,
      startCn: 1,
      command: '-',
      pitches: ['a'],
    }
    const expected: [Key | null, number] = [expectedKey, i + 3]
    expect(eatKey(chars, i)).toStrictEqual(expected)
  })

  test('When "kabc=" is found, it returns Key and the next index.', () => {
    const chars = [
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: 'b', ln: 1, cn: 3},
      {c: 'c', ln: 1, cn: 4},
      {c: '=', ln: 1, cn: 5},
    ]
    const i = 0
    const expectedKey: Key = {
      startLn: 1,
      startCn: 1,
      command: '=',
      pitches: ['a', 'b', 'c'],
    }
    const expected: [Key | null, number] = [expectedKey, i + 5]
    expect(eatKey(chars, i)).toStrictEqual(expected)
  })
})
