import {describe, expect, test} from 'bun:test'
import {Length} from './Length'
import {Characters} from '../parse/Characters'

describe('Length.from', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'l', ln: 1, cn: 1},
      {c: '4', ln: 1, cn: 2},
    ])
    chars.forward(2)
    expect(Length.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual(null)
  })

  test('When no Length is found, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'l', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: '4', ln: 1, cn: 3},
    ])
    chars.forward(1)
    expect(Length.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual({c: 'b', ln: 1, cn: 2})
  })

  test('When the Length number is not found on the same line, it throws an error.', () => {
    const chars = new Characters([
      {c: 'l', ln: 1, cn: 1},
      {c: '4', ln: 2, cn: 1},
    ])
    expect(() => Length.from(chars)).toThrow()
  })

  test('When the Length number is not found, it throws an error.', () => {
    const chars = new Characters([
      {c: 'l', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
    ])
    expect(() => Length.from(chars)).toThrow()
  })

  test('When the Length number is 0, it throws an error.', () => {
    const chars = new Characters([
      {c: 'l', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
    ])
    expect(() => Length.from(chars)).toThrow()
  })

  test('When an Length is found, it returns Length and the next index.', () => {
    const chars = new Characters([
      {c: 'l', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '6', ln: 1, cn: 3},
      {c: 'a', ln: 1, cn: 4},
    ])
    const length = Length.from(chars)!
    expect(length.getNoteValue()).toStrictEqual(16)
    expect(chars.get()).toStrictEqual({c: 'a', ln: 1, cn: 4})
  })
})
