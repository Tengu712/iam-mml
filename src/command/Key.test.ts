import {describe, expect, test} from 'bun:test'
import {Key} from './Key'
import {Characters} from '../parse/Characters'
import type {Pitch} from '../constants'

describe('Key.from', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '+', ln: 1, cn: 3},
    ])
    chars.forward(3)
    expect(Key.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual(null)
  })

  test('When no key is found, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '+', ln: 1, cn: 3},
    ])
    chars.forward(1)
    expect(Key.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual({c: 'a', ln: 1, cn: 2})
  })

  test('When the command is not found, it throws an error.', () => {
    const chars = new Characters([
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
    ])
    expect(() => Key.from(chars)).toThrow()
  })

  test('When the command is not found on the same line, it throws an error.', () => {
    const chars = new Characters([
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '+', ln: 2, cn: 1},
    ])
    expect(() => Key.from(chars)).toThrow()
  })

  test('When it is in the middle, it throws an error.', () => {
    const chars = new Characters([
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: 'b', ln: 1, cn: 3},
      {c: 'c', ln: 2, cn: 1},
      {c: '+', ln: 2, cn: 2},
    ])
    expect(() => Key.from(chars)).toThrow()
  })

  test('When "k+" is found, it returns Key and the next index.', () => {
    const chars = new Characters([
      {c: 'k', ln: 1, cn: 1},
      {c: '+', ln: 1, cn: 2},
      {c: 'a', ln: 1, cn: 3},
    ])
    const key = Key.from(chars)!
    expect(key.getCommand()).toStrictEqual('+')
    expect(key.getPitches()).toStrictEqual([])
    expect(chars.get()).toStrictEqual({c: 'a', ln: 1, cn: 3})
  })

  test('When "ka-" is found, it returns Key and the next index.', () => {
    const chars = new Characters([
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '-', ln: 1, cn: 3},
      {c: '-', ln: 1, cn: 4},
    ])
    const key = Key.from(chars)!
    expect(key.getCommand()).toStrictEqual('-')
    expect(key.getPitches()).toStrictEqual(['a'])
    expect(chars.get()).toStrictEqual({c: '-', ln: 1, cn: 4})
  })

  test('When "kabc=" is found, it returns Key and the next index.', () => {
    const chars = new Characters([
      {c: 'k', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: 'b', ln: 1, cn: 3},
      {c: 'c', ln: 1, cn: 4},
      {c: '=', ln: 1, cn: 5},
    ])
    const key = Key.from(chars)!
    expect(key.getCommand()).toStrictEqual('=')
    expect(key.getPitches()).toStrictEqual(['a', 'b', 'c'])
    expect(chars.get()).toStrictEqual(null)
  })
})
