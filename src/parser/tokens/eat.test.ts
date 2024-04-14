import {describe, expect, test} from 'bun:test'
import {
  eatChar,
  eatFloatingPointNumber,
  eatNaturalNumber,
  eatSpaces,
} from './eat'

describe('eatChar', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ]
    const i = 3
    const matches = ['a', 'b', 'c']
    const expected: [string | null, number] = [null, i]
    expect(eatChar(chars, i, matches)).toStrictEqual(expected)
  })

  test('When no match is found, it returns null and the current index.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ]
    const i = 1
    const matches = ['d', 'e', 'f', 'g']
    const expected: [string | null, number] = [null, i]
    expect(eatChar(chars, i, matches)).toStrictEqual(expected)
  })

  test('When a match is found, it returns the matched character and the index of the next character.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ]
    const i = 1
    const matches = ['d', 'e', 'b', 'g']
    const expected: [string | null, number] = ['b', i + 1]
    expect(eatChar(chars, i, matches)).toStrictEqual(expected)
  })
})

describe('eatSpaces', () => {
  test('When trying to eat out of range, it returns the current index.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: ' ', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ]
    const i = 3
    const expected = i
    expect(eatSpaces(chars, i)).toStrictEqual(expected)
  })

  test('When no space or tab is found, it returns the current index.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ]
    const i = 1
    const expected = i
    expect(eatSpaces(chars, i)).toStrictEqual(expected)
  })

  test('When spaces or tabs are found, it returns the index of the next non-space or non-tab character.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: ' ', ln: 1, cn: 2},
      {c: '\t', ln: 1, cn: 3},
      {c: ' ', ln: 2, cn: 1},
      {c: ' ', ln: 2, cn: 2},
      {c: 'c', ln: 2, cn: 3},
    ]
    const i = 1
    const expected = i + 4
    expect(eatSpaces(chars, i)).toStrictEqual(expected)
  })
})

describe('eatNaturalNumber', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = [
      {c: '0', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '2', ln: 1, cn: 3},
    ]
    const i = 3
    const expected: [number | null, number] = [null, i]
    expect(eatNaturalNumber(chars, i)).toStrictEqual(expected)
  })

  test('When no integer is found, it returns null and the current index.', () => {
    const chars = [
      {c: '0', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
    ]
    const i = 1
    const expected: [number | null, number] = [null, i]
    expect(eatNaturalNumber(chars, i)).toStrictEqual(expected)
  })

  test('When an integer is found, it returns the integer and the index of the next non-digit character.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
      {c: '.', ln: 1, cn: 5},
      {c: '3', ln: 1, cn: 6},
    ]
    const i = 1
    const expected: [number | null, number] = [12, i + 3]
    expect(eatNaturalNumber(chars, i)).toStrictEqual(expected)
  })

  test('When an integer spanning multiple lines is found, it returns the integer found on the same line and the index of the next non-digit character.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
      {c: '3', ln: 1, cn: 5},
      {c: '4', ln: 2, cn: 1},
    ]
    const i = 1
    const expected: [number | null, number] = [123, i + 4]
    expect(eatNaturalNumber(chars, i)).toStrictEqual(expected)
  })
})

describe('eatFloatingPointNumber', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = [
      {c: '0', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
    ]
    const i = 4
    const expected: [number | null, number] = [null, i]
    expect(eatFloatingPointNumber(chars, i)).toStrictEqual(expected)
  })

  test('When no number is found, it returns null and the current index.', () => {
    const chars = [
      {c: '0', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
    ]
    const i = 1
    const expected: [number | null, number] = [null, i]
    expect(eatFloatingPointNumber(chars, i)).toStrictEqual(expected)
  })

  test('When no floating-point number is found, it returns null and the current index.', () => {
    const chars = [
      {c: '1', ln: 1, cn: 1},
      {c: '2', ln: 1, cn: 2},
    ]
    const i = 0
    const expected: [number | null, number] = [null, i]
    expect(eatFloatingPointNumber(chars, i)).toStrictEqual(expected)
  })

  test('When a floating-point number is found, it returns the floating-point number and the index of the next non-digit character.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
      {c: '.', ln: 1, cn: 5},
      {c: '3', ln: 1, cn: 6},
      {c: 'b', ln: 1, cn: 7},
    ]
    const i = 1
    const expected: [number | null, number] = [12.3, i + 5]
    expect(eatFloatingPointNumber(chars, i)).toStrictEqual(expected)
  })

  test('When a floating-point number spanning multiple lines is found, it returns the floating-point number found on the same line and the index of the next non-digit character.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '.', ln: 1, cn: 4},
      {c: '2', ln: 1, cn: 5},
      {c: '3', ln: 2, cn: 1},
    ]
    const i = 1
    const expected: [number | null, number] = [1.2, i + 4]
    expect(eatFloatingPointNumber(chars, i)).toStrictEqual(expected)
  })
})
