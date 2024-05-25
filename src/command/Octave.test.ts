import {describe, expect, test} from 'bun:test'
import {Octave} from './Octave'
import {Characters} from '../parse/Characters'

describe('Octave.from', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'o', ln: 1, cn: 1},
      {c: '4', ln: 1, cn: 2},
    ])
    chars.forward(2)
    expect(Octave.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual(null)
  })

  test('When no octave is found, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'o', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: '4', ln: 1, cn: 3},
    ])
    chars.forward(1)
    expect(Octave.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual({c: 'b', ln: 1, cn: 2})
  })

  test('When the octave number is not found on the same line, it throws an error.', () => {
    const chars = new Characters([
      {c: 'o', ln: 1, cn: 1},
      {c: '4', ln: 2, cn: 1},
    ])
    expect(() => Octave.from(chars)).toThrow()
  })

  test('When the octave number is not found, it throws an error.', () => {
    const chars = new Characters([
      {c: 'o', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
    ])
    expect(() => Octave.from(chars)).toThrow()
  })

  test('When "o4" is found, it returns Octave and the next index.', () => {
    const chars = new Characters([
      {c: 'o', ln: 1, cn: 1},
      {c: '4', ln: 1, cn: 2},
      {c: 'a', ln: 1, cn: 3},
    ])
    const octave = Octave.from(chars)!
    expect(octave.getCommand()).toStrictEqual(null)
    expect(octave.getOctave()).toStrictEqual(4)
    expect(chars.get()).toStrictEqual({c: 'a', ln: 1, cn: 3})
  })

  test('When ">" is found, it returns Octave and the next index.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: '>', ln: 1, cn: 2},
      {c: 'o', ln: 1, cn: 3},
      {c: '4', ln: 1, cn: 4},
    ])
    chars.forward(1)
    const octave = Octave.from(chars)!
    expect(octave.getCommand()).toStrictEqual('>')
    expect(octave.getOctave()).toStrictEqual(0)
    expect(chars.get()).toStrictEqual({c: 'o', ln: 1, cn: 3})
  })

  test('When "<" is found, it returns Octave and the next index.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: '<', ln: 1, cn: 2},
      {c: 'o', ln: 1, cn: 3},
      {c: '4', ln: 1, cn: 4},
    ])
    chars.forward(1)
    const octave = Octave.from(chars)!
    expect(octave.getCommand()).toStrictEqual('<')
    expect(octave.getOctave()).toStrictEqual(0)
    expect(chars.get()).toStrictEqual({c: 'o', ln: 1, cn: 3})
  })
})
