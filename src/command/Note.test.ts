import {describe, expect, test} from 'bun:test'
import {Note} from './Note'
import {Characters} from '../parse/Characters'

describe('Note.from', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ])
    chars.forward(3)
    expect(Note.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual(null)
  })

  test('When no note is found, it returns null and the current index.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: 'n', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ])
    chars.forward(1)
    expect(Note.from(chars)).toStrictEqual(null)
    expect(chars.get()).toStrictEqual({c: 'n', ln: 1, cn: 2})
  })

  test('When a note whose value is 0 is found, it throws an error.', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
    ])
    expect(() => Note.from(chars)).toThrow()
  })

  test('When "aa" is found, it eats "a".', () => {
    const chars = new Characters([
      {c: 'a', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: 'a', ln: 1, cn: 3},
    ])
    chars.forward(1)
    const note = Note.from(chars)!
    expect(note.getPitch()).toStrictEqual('a')
    expect(note.getAccidental()).toStrictEqual(null)
    expect(note.getNoteValue()).toStrictEqual(null)
    expect(note.isDotted()).toStrictEqual(false)
  })

  test('When "b+-" is found, it eats "b+".', () => {
    const chars = new Characters([
      {c: 'b', ln: 1, cn: 1},
      {c: '+', ln: 1, cn: 2},
      {c: '-', ln: 1, cn: 3},
    ])
    const note = Note.from(chars)!
    expect(note.getPitch()).toStrictEqual('b')
    expect(note.getAccidental()).toStrictEqual('+')
    expect(note.getNoteValue()).toStrictEqual(null)
    expect(note.isDotted()).toStrictEqual(false)
  })

  test('When "c4+" is found, it eats "c4".', () => {
    const chars = new Characters([
      {c: 'c', ln: 1, cn: 1},
      {c: '4', ln: 1, cn: 2},
      {c: '+', ln: 1, cn: 3},
    ])
    const note = Note.from(chars)!
    expect(note.getPitch()).toStrictEqual('c')
    expect(note.getAccidental()).toStrictEqual(null)
    expect(note.getNoteValue()).toStrictEqual(4)
    expect(note.isDotted()).toStrictEqual(false)
  })

  test('When "d-16=" is found, it eats "d-16".', () => {
    const chars = new Characters([
      {c: 'd', ln: 1, cn: 1},
      {c: '-', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '6', ln: 1, cn: 4},
      {c: '=', ln: 1, cn: 5},
    ])
    const note = Note.from(chars)!
    expect(note.getPitch()).toStrictEqual('d')
    expect(note.getAccidental()).toStrictEqual('-')
    expect(note.getNoteValue()).toStrictEqual(16)
    expect(note.isDotted()).toStrictEqual(false)
  })

  test('When "e8.2" is found, it eats "e8.".', () => {
    const chars = new Characters([
      {c: 'e', ln: 1, cn: 1},
      {c: '8', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
    ])
    const note = Note.from(chars)!
    expect(note.getPitch()).toStrictEqual('e')
    expect(note.getAccidental()).toStrictEqual(null)
    expect(note.getNoteValue()).toStrictEqual(8)
    expect(note.isDotted()).toStrictEqual(true)
  })

  test('When "f=32.." is found, it eats "f=32.".', () => {
    const chars = new Characters([
      {c: 'f', ln: 1, cn: 1},
      {c: '=', ln: 1, cn: 2},
      {c: '3', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
      {c: '.', ln: 1, cn: 5},
      {c: '.', ln: 1, cn: 6},
    ])
    const note = Note.from(chars)!
    expect(note.getPitch()).toStrictEqual('f')
    expect(note.getAccidental()).toStrictEqual('=')
    expect(note.getNoteValue()).toStrictEqual(32)
    expect(note.isDotted()).toStrictEqual(true)
  })

  test('When a note spanning multiple lines is found, it returns the note found on the same line and the index of the next line character.', () => {
    const chars = new Characters([
      {c: 'f', ln: 1, cn: 1},
      {c: '=', ln: 1, cn: 2},
      {c: '3', ln: 1, cn: 3},
      {c: '2', ln: 2, cn: 1},
      {c: '.', ln: 2, cn: 2},
    ])
    const note = Note.from(chars)!
    expect(note.getPitch()).toStrictEqual('f')
    expect(note.getAccidental()).toStrictEqual('=')
    expect(note.getNoteValue()).toStrictEqual(3)
    expect(note.isDotted()).toStrictEqual(false)
  })
})
