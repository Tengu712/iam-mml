import {describe, expect, test} from 'bun:test'
import {Characters} from './Characters'

describe('eatChar', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ])
    chars.forward(3)
    const matches = ['a', 'b', 'c']
    const expected = null
    const expected2 = null
    expect(chars.eatChar(matches)).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When no match is found, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ])
    chars.forward(1)
    const matches = ['a', 'c', 'd']
    const expected = null
    const expected2 = {c: 'b', ln: 1, cn: 2}
    expect(chars.eatChar(matches)).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When a match is found, it returns the matched character and the index of the next character.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ])
    chars.forward(1)
    const matches = ['a', 'b', 'c']
    const expected = 'b'
    const expected2 = {c: 'c', ln: 1, cn: 3}
    expect(chars.eatChar(matches)).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })
})

describe('eatSpaces', () => {
  test('When trying to eat out of range, it returns the current index.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: ' ', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ])
    chars.forward(3)
    chars.eatSpaces()
    const expected = null
    expect(chars.get()).toStrictEqual(expected)
  })

  test('When no space or tab is found, it returns the current index.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ])
    chars.forward(1)
    chars.eatSpaces()
    const expected = {c: 'b', ln: 1, cn: 2}
    expect(chars.get()).toStrictEqual(expected)
  })

  test('When spaces or tabs are found, it returns the index of the next non-space or non-tab character.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: ' ', ln: 1, cn: 2},
      {c: '\t', ln: 1, cn: 3},
      {c: ' ', ln: 2, cn: 1},
      {c: ' ', ln: 2, cn: 2},
      {c: 'c', ln: 2, cn: 3},
    ])
    chars.forward(1)
    chars.eatSpaces()
    const expected = {c: 'c', ln: 2, cn: 3}
    expect(chars.get()).toStrictEqual(expected)
  })
})

describe('eatNatural', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: '0', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '2', ln: 1, cn: 3},
    ])
    chars.forward(3)
    const expected = null
    const expected2 = null
    expect(chars.eatNatural()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When no integer is found, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: '0', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
    ])
    chars.forward(1)
    const expected = null
    const expected2 = {c: 'a', ln: 1, cn: 2}
    expect(chars.eatNatural()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When an integer is found, it returns the integer and the index of the next non-digit character.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
      {c: '.', ln: 1, cn: 5},
      {c: '3', ln: 1, cn: 6},
    ])
    chars.forward(1)
    const expected = 12
    const expected2 = {c: '.', ln: 1, cn: 5}
    expect(chars.eatNatural()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When an integer spanning multiple lines is found, it returns the integer found on the same line and the index of the next non-digit character.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '2', ln: 2, cn: 1},
      {c: '.', ln: 2, cn: 2},
      {c: '3', ln: 2, cn: 3},
    ])
    chars.forward(1)
    const expected = 1
    const expected2 = {c: '2', ln: 2, cn: 1}
    expect(chars.eatNatural()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })
})

describe('eatNNFloat', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: '0', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
    ])
    chars.forward(4)
    const expected = null
    const expected2 = null
    expect(chars.eatNNFloat()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When no number is found, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: '0', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
    ])
    chars.forward(1)
    const expected = null
    const expected2 = {c: 'a', ln: 1, cn: 2}
    expect(chars.eatNNFloat()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When "12" is found, it returns "12" and the index of the next non-digit character.', () => {
    const chars = new Characters([
      {c: '1', ln: 1, cn: 1},
      {c: '2', ln: 1, cn: 2},
      {c: '.', ln: 2, cn: 1},
      {c: '5', ln: 2, cn: 2},
    ])
    const expected = 12
    const expected2 = {c: '.', ln: 2, cn: 1}
    expect(chars.eatNNFloat()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When "012.3b" is found, it returns "12.3" and the index of the next non-digit character.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
      {c: '.', ln: 1, cn: 5},
      {c: '3', ln: 1, cn: 6},
      {c: 'b', ln: 1, cn: 7},
    ])
    chars.forward(1)
    const expected = 12.3
    const expected2 = {c: 'b', ln: 1, cn: 7}
    expect(chars.eatNNFloat()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When "01.\\n23" is found, it throws an error.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '.', ln: 1, cn: 4},
      {c: '2', ln: 2, cn: 5},
      {c: '3', ln: 2, cn: 1},
    ])
    chars.forward(1)
    expect(() => chars.eatNNFloat()).toThrow()
  })
})

describe('eatIdentifier', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: ' ', ln: 1, cn: 3},
      {c: '.', ln: 1, cn: 4},
    ])
    chars.forward(4)
    const expected = null
    const expected2 = null
    expect(chars.eatIdentifier()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When no identifier is found, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: ' ', ln: 1, cn: 3},
      {c: '.', ln: 1, cn: 4},
    ])
    chars.forward(2)
    const expected = null
    const expected2 = {c: ' ', ln: 1, cn: 3}
    expect(chars.eatIdentifier()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When "a1 ." is found, it returns "a1" and the index of the next character.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: ' ', ln: 1, cn: 3},
      {c: '.', ln: 1, cn: 4},
    ])
    const expected = 'a1'
    const expected2 = {c: ' ', ln: 1, cn: 3}
    expect(chars.eatIdentifier()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })

  test('When "1.\\n23" is found, it returns "1." and the index of the next character.', () => {
    const chars = new Characters([
      {c: '1', ln: 1, cn: 1},
      {c: '.', ln: 1, cn: 2},
      {c: '2', ln: 2, cn: 1},
      {c: '3', ln: 2, cn: 2},
    ])
    const expected = '1.'
    const expected2 = {c: '2', ln: 2, cn: 1}
    expect(chars.eatIdentifier()).toStrictEqual(expected)
    expect(chars.get()).toStrictEqual(expected2)
  })
})
