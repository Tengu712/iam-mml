import {describe, expect, test} from 'bun:test'
import {eatVolume, type Volume} from './volume'

describe('eatVolume', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = [
      {c: 'v', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '5', ln: 1, cn: 4},
    ]
    const i = 4
    const expected: [Volume | null, number] = [null, i]
    expect(eatVolume(chars, i)).toStrictEqual(expected)
  })

  test('When no volume is found, it returns null and the current index.', () => {
    const chars = [
      {c: 'v', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '5', ln: 1, cn: 4},
    ]
    const i = 1
    const expected: [Volume | null, number] = [null, i]
    expect(eatVolume(chars, i)).toStrictEqual(expected)
  })

  test('When the volume number is not found on the same line, it throws an error.', () => {
    const chars = [
      {c: 'v', ln: 1, cn: 1},
      {c: '+', ln: 1, cn: 2},
      {c: '0', ln: 2, cn: 1},
      {c: '.', ln: 2, cn: 2},
      {c: '5', ln: 2, cn: 3},
    ]
    const i = 0
    expect(() => eatVolume(chars, i)).toThrow()
  })

  test('When "v0.5" is found, it returns volume and the next index.', () => {
    const chars = [
      {c: 'v', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '5', ln: 1, cn: 4},
    ]
    const i = 0
    const expectedVolume: Volume = {
      startLn: 1,
      startCn: 1,
      command: null,
      volume: 0.5,
    }
    const expected: [Volume | null, number] = [expectedVolume, i + 4]
    expect(eatVolume(chars, i)).toStrictEqual(expected)
  })

  test('When "v+0.2" is found, it returns volume and the next index.', () => {
    const chars = [
      {c: 'v', ln: 1, cn: 1},
      {c: '+', ln: 1, cn: 2},
      {c: '0', ln: 1, cn: 3},
      {c: '.', ln: 1, cn: 4},
      {c: '2', ln: 1, cn: 5},
    ]
    const i = 0
    const expectedVolume: Volume = {
      startLn: 1,
      startCn: 1,
      command: '+',
      volume: 0.2,
    }
    const expected: [Volume | null, number] = [expectedVolume, i + 5]
    expect(eatVolume(chars, i)).toStrictEqual(expected)
  })

  test('When "v-1.0" is found, it returns volume and the next index.', () => {
    const chars = [
      {c: 'v', ln: 1, cn: 1},
      {c: '-', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '.', ln: 1, cn: 4},
      {c: '0', ln: 1, cn: 5},
    ]
    const i = 0
    const expectedVolume: Volume = {
      startLn: 1,
      startCn: 1,
      command: '-',
      volume: 1.0,
    }
    const expected: [Volume | null, number] = [expectedVolume, i + 5]
    expect(eatVolume(chars, i)).toStrictEqual(expected)
  })
})
