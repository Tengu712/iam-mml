import {describe, expect, test} from 'bun:test'
import {eatTempo, type Tempo} from './tempo'

describe('eatTempo', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = [
      {c: 't', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '2', ln: 1, cn: 3},
      {c: '0', ln: 1, cn: 4},
      {c: '.', ln: 1, cn: 5},
      {c: '0', ln: 1, cn: 6},
    ]
    const i = 6
    const expected: [Tempo | null, number] = [null, i]
    expect(eatTempo(chars, i)).toStrictEqual(expected)
  })

  test('When no tempo is found, it returns null and the current index.', () => {
    const chars = [
      {c: 't', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '2', ln: 1, cn: 3},
      {c: '0', ln: 1, cn: 4},
      {c: '.', ln: 1, cn: 5},
      {c: '0', ln: 1, cn: 6},
    ]
    const i = 1
    const expected: [Tempo | null, number] = [null, i]
    expect(eatTempo(chars, i)).toStrictEqual(expected)
  })

  test('When the tempo number is not found on the same line, it throws an error.', () => {
    const chars = [
      {c: 't', ln: 1, cn: 1},
      {c: '+', ln: 1, cn: 2},
      {c: '1', ln: 2, cn: 1},
      {c: '2', ln: 2, cn: 2},
      {c: '0', ln: 2, cn: 3},
      {c: '.', ln: 2, cn: 4},
      {c: '0', ln: 2, cn: 5},
    ]
    const i = 0
    expect(() => eatTempo(chars, i)).toThrow()
  })

  test('When it is the tempo setting command and the number is smaller than 1, it throws an error.', () => {
    const chars = [
      {c: 't', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '5', ln: 1, cn: 4},
    ]
    const i = 0
    expect(() => eatTempo(chars, i)).toThrow()
  })

  test('When it is the tempo setting command and the number is greater than 1000, it throws an error.', () => {
    const chars = [
      {c: 't', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '0', ln: 1, cn: 3},
      {c: '0', ln: 1, cn: 4},
      {c: '0', ln: 1, cn: 5},
      {c: '.', ln: 1, cn: 6},
      {c: '5', ln: 1, cn: 7},
    ]
    const i = 0
    expect(() => eatTempo(chars, i)).toThrow()
  })

  test('When "t120.0" is found, it returns tempo and the next index.', () => {
    const chars = [
      {c: 't', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '2', ln: 1, cn: 3},
      {c: '0', ln: 1, cn: 4},
      {c: '.', ln: 1, cn: 5},
      {c: '0', ln: 1, cn: 6},
    ]
    const i = 0
    const expectedTempo: Tempo = {
      startLn: 1,
      startCn: 1,
      command: null,
      tempo: 120.0,
    }
    const expected: [Tempo | null, number] = [expectedTempo, i + 6]
    expect(eatTempo(chars, i)).toStrictEqual(expected)
  })

  test('When "t+0.5" is found, it returns tempo and the next index.', () => {
    const chars = [
      {c: 't', ln: 1, cn: 1},
      {c: '+', ln: 1, cn: 2},
      {c: '0', ln: 1, cn: 3},
      {c: '.', ln: 1, cn: 4},
      {c: '5', ln: 1, cn: 5},
    ]
    const i = 0
    const expectedTempo: Tempo = {
      startLn: 1,
      startCn: 1,
      command: '+',
      tempo: 0.5,
    }
    const expected: [Tempo | null, number] = [expectedTempo, i + 5]
    expect(eatTempo(chars, i)).toStrictEqual(expected)
  })

  test('When "t-15.0" is found, it returns tempo and the next index.', () => {
    const chars = [
      {c: 't', ln: 1, cn: 1},
      {c: '-', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '5', ln: 1, cn: 4},
      {c: '.', ln: 1, cn: 5},
      {c: '0', ln: 1, cn: 6},
    ]
    const i = 0
    const expectedTempo: Tempo = {
      startLn: 1,
      startCn: 1,
      command: '-',
      tempo: 15.0,
    }
    const expected: [Tempo | null, number] = [expectedTempo, i + 6]
    expect(eatTempo(chars, i)).toStrictEqual(expected)
  })
})
