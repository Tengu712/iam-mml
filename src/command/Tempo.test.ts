import {describe, expect, test} from 'bun:test'
import {Tempo} from './Tempo'
import {Characters} from '../parse/Characters'

describe('Tempo.from', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 't', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '2', ln: 1, cn: 3},
      {c: '0', ln: 1, cn: 4},
    ])
    chars.forward(4)
    expect(Tempo.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual(null)
  })

  test('When no tempo is found, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 't', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '2', ln: 1, cn: 3},
      {c: '0', ln: 1, cn: 4},
    ])
    chars.forward(1)
    expect(Tempo.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual({c: '1', ln: 1, cn: 2})
  })

  test('When the tempo number is not found on the same line, it throws an error.', () => {
    const chars = new Characters([
      {c: 't', ln: 1, cn: 1},
      {c: '+', ln: 1, cn: 2},
      {c: '1', ln: 2, cn: 1},
      {c: '2', ln: 2, cn: 2},
      {c: '0', ln: 2, cn: 3},
    ])
    expect(() => Tempo.from(chars)).toThrow()
  })

  test('When it is the tempo setting command and the number is smaller than 1, it throws an error.', () => {
    const chars = new Characters([
      {c: 't', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '5', ln: 1, cn: 4},
    ])
    expect(() => Tempo.from(chars)).toThrow()
  })

  test('When it is the tempo setting command and the number is greater than 1000, it throws an error.', () => {
    const chars = new Characters([
      {c: 't', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '0', ln: 1, cn: 3},
      {c: '0', ln: 1, cn: 4},
      {c: '0', ln: 1, cn: 5},
      {c: '.', ln: 1, cn: 6},
      {c: '5', ln: 1, cn: 7},
    ])
    expect(() => Tempo.from(chars)).toThrow()
  })

  test('When "t120" is found, it returns tempo and the next index.', () => {
    const chars = new Characters([
      {c: 't', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '2', ln: 1, cn: 3},
      {c: '0', ln: 1, cn: 4},
      {c: 'a', ln: 1, cn: 5},
    ])
    const tempo = Tempo.from(chars)!
    expect(tempo.getCommand()).toStrictEqual(null)
    expect(tempo.getTempo()).toStrictEqual(120)
    expect(chars.get()).toStrictEqual({c: 'a', ln: 1, cn: 5})
  })

  test('When "t0.5+" is found, it returns tempo and the next index.', () => {
    const chars = new Characters([
      {c: 't', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '5', ln: 1, cn: 4},
      {c: '+', ln: 1, cn: 5},
    ])
    const tempo = Tempo.from(chars)!
    expect(tempo.getCommand()).toStrictEqual('+')
    expect(tempo.getTempo()).toStrictEqual(0.5)
    expect(chars.get()).toStrictEqual(null)
  })

  test('When "t2-" is found, it returns tempo and the next index.', () => {
    const chars = new Characters([
      {c: 't', ln: 1, cn: 1},
      {c: '2', ln: 1, cn: 2},
      {c: '-', ln: 1, cn: 3},
    ])
    const tempo = Tempo.from(chars)!
    expect(tempo.getCommand()).toStrictEqual('-')
    expect(tempo.getTempo()).toStrictEqual(2)
    expect(chars.get()).toStrictEqual(null)
  })
})
