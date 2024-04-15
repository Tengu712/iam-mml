import {describe, expect, test} from 'bun:test'
import {eatOctave, type Octave} from './octave'

describe('eatOctave', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = [
      {c: 'o', ln: 1, cn: 1},
      {c: '4', ln: 1, cn: 2},
    ]
    const i = 2
    const expected: [Octave | null, number] = [null, i]
    expect(eatOctave(chars, i)).toStrictEqual(expected)
  })

  test('When no octave is found, it returns null and the current index.', () => {
    const chars = [
      {c: 'o', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: '4', ln: 1, cn: 3},
    ]
    const i = 1
    const expected: [Octave | null, number] = [null, i]
    expect(eatOctave(chars, i)).toStrictEqual(expected)
  })

  test('When the octave number is not found on the same line, it throws an error.', () => {
    const chars = [
      {c: 'o', ln: 1, cn: 1},
      {c: '4', ln: 2, cn: 1},
    ]
    const i = 0
    expect(() => eatOctave(chars, i)).toThrow()
  })

  test('When the octave number is not found, it throws an error.', () => {
    const chars = [
      {c: 'o', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
    ]
    const i = 0
    expect(() => eatOctave(chars, i)).toThrow()
  })

  test('When "o4" is found, it returns Octave and the next index.', () => {
    const chars = [
      {c: 'o', ln: 1, cn: 1},
      {c: '4', ln: 1, cn: 2},
    ]
    const i = 0
    const expectedOctave: Octave = {
      startLn: 1,
      startCn: 1,
      command: null,
      octave: 4,
    }
    const expected: [Octave | null, number] = [expectedOctave, i + 2]
    expect(eatOctave(chars, i)).toStrictEqual(expected)
  })

  test('When ">" is found, it returns Octave and the next index.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: '>', ln: 1, cn: 2},
      {c: 'o', ln: 1, cn: 3},
      {c: '4', ln: 1, cn: 4},
    ]
    const i = 1
    const expectedOctave: Octave = {
      startLn: 1,
      startCn: 2,
      command: '>',
      octave: 0,
    }
    const expected: [Octave | null, number] = [expectedOctave, i + 1]
    expect(eatOctave(chars, i)).toStrictEqual(expected)
  })

  test('When "<" is found, it returns Octave and the next index.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: '<', ln: 1, cn: 2},
      {c: 'o', ln: 1, cn: 3},
      {c: '4', ln: 1, cn: 4},
    ]
    const i = 1
    const expectedOctave: Octave = {
      startLn: 1,
      startCn: 2,
      command: '<',
      octave: 0,
    }
    const expected: [Octave | null, number] = [expectedOctave, i + 1]
    expect(eatOctave(chars, i)).toStrictEqual(expected)
  })
})
