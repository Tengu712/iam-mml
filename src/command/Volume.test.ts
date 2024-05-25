import {describe, expect, test} from 'bun:test'
import {Volume} from './Volume'
import {Characters} from '../parse/Characters'

describe('Volume.from', () => {
  test('When trying to eat out of ranget returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'v', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '5', ln: 1, cn: 4},
    ])
    chars.forward(4)
    expect(Volume.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual(null)
  })

  test('When no volume is foundt returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'v', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '5', ln: 1, cn: 4},
    ])
    chars.forward(1)
    expect(Volume.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual({c: '0', ln: 1, cn: 2})
  })

  test('When the volume number is not found on the same linet throws an error.', () => {
    const chars = new Characters([
      {c: 'v', ln: 1, cn: 1},
      {c: '0', ln: 2, cn: 1},
      {c: '.', ln: 2, cn: 2},
      {c: '5', ln: 2, cn: 3},
    ])
    expect(() => Volume.from(chars)).toThrow()
  })

  test('When the volume number is greater than 1.0 throws an error. (1)', () => {
    const chars = new Characters([
      {c: 'v', ln: 1, cn: 1},
      {c: '2', ln: 1, cn: 2},
    ])
    expect(() => Volume.from(chars)).toThrow()
  })

  test('When the volume number is greater than 1.0 throws an error. (2)', () => {
    const chars = new Characters([
      {c: 'v', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '1', ln: 1, cn: 4},
      {c: '+', ln: 1, cn: 5},
    ])
    expect(() => Volume.from(chars)).toThrow()
  })

  test('When "v0.5" is found returns volume and the next index.', () => {
    const chars = new Characters([
      {c: 'v', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '5', ln: 1, cn: 4},
      {c: 'a', ln: 1, cn: 5},
    ])
    const volume = Volume.from(chars)!
    expect(volume.getCommand()).toStrictEqual(null)
    expect(volume.getVolume()).toStrictEqual(0.5)
    expect(chars.get()).toStrictEqual({c: 'a', ln: 1, cn: 5})
  })

  test('When "v0.2+" is foundt returns volume and the next index.', () => {
    const chars = new Characters([
      {c: 'v', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
      {c: '+', ln: 1, cn: 5},
    ])
    const volume = Volume.from(chars)!
    expect(volume.getCommand()).toStrictEqual('+')
    expect(volume.getVolume()).toStrictEqual(0.2)
    expect(chars.get()).toStrictEqual(null)
  })

  test('When "v1.0-" is foundt returns volume and the next index.', () => {
    const chars = new Characters([
      {c: 'v', ln: 1, cn: 1},
      {c: '1', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '0', ln: 1, cn: 4},
      {c: '-', ln: 1, cn: 5},
    ])
    const volume = Volume.from(chars)!
    expect(volume.getCommand()).toStrictEqual('-')
    expect(volume.getVolume()).toStrictEqual(1.0)
    expect(chars.get()).toStrictEqual(null)
  })
})
