import {describe, expect, test} from 'bun:test'
import {eatNote, type Note} from './note'

describe('eatNote', () => {
  test('When trying to eat out of range, it returns null and the current index.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: 'b', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ]
    const i = 3
    const expected: [Note | null, number] = [null, i]
    expect(eatNote(chars, i)).toStrictEqual(expected)
  })

  test('When no note is found, it returns null and the current index.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: 'n', ln: 1, cn: 2},
      {c: 'c', ln: 1, cn: 3},
    ]
    const i = 1
    const expected: [Note | null, number] = [null, i]
    expect(eatNote(chars, i)).toStrictEqual(expected)
  })

  test('When a note whose value is 0 is found, it throws an error.', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: '0', ln: 1, cn: 2},
    ]
    const i = 0
    expect(() => eatNote(chars, i)).toThrow()
  })

  test('When "aa" is found, it eats "a".', () => {
    const chars = [
      {c: 'a', ln: 1, cn: 1},
      {c: 'a', ln: 1, cn: 2},
      {c: 'a', ln: 1, cn: 3},
    ]
    const i = 1
    const expectedNote: Note = {
      startLn: 1,
      startCn: 2,
      pitch: 'a',
      accidental: null,
      noteValue: null,
      dotted: false,
    }
    const expected: [Note | null, number] = [expectedNote, i + 1]
    expect(eatNote(chars, i)).toStrictEqual(expected)
  })

  test('When "b+-" is found, it eats "b+".', () => {
    const chars = [
      {c: 'b', ln: 1, cn: 1},
      {c: '+', ln: 1, cn: 2},
      {c: '-', ln: 1, cn: 3},
    ]
    const i = 0
    const expectedNote: Note = {
      startLn: 1,
      startCn: 1,
      pitch: 'b',
      accidental: '+',
      noteValue: null,
      dotted: false,
    }
    const expected: [Note | null, number] = [expectedNote, i + 2]
    expect(eatNote(chars, i)).toStrictEqual(expected)
  })

  test('When "c4+" is found, it eats "c4".', () => {
    const chars = [
      {c: 'c', ln: 1, cn: 1},
      {c: '4', ln: 1, cn: 2},
      {c: '+', ln: 1, cn: 3},
    ]
    const i = 0
    const expectedNote: Note = {
      startLn: 1,
      startCn: 1,
      pitch: 'c',
      accidental: null,
      noteValue: 4,
      dotted: false,
    }
    const expected: [Note | null, number] = [expectedNote, i + 2]
    expect(eatNote(chars, i)).toStrictEqual(expected)
  })

  test('When "d-16=" is found, it eats "d-16".', () => {
    const chars = [
      {c: 'd', ln: 1, cn: 1},
      {c: '-', ln: 1, cn: 2},
      {c: '1', ln: 1, cn: 3},
      {c: '6', ln: 1, cn: 4},
      {c: '=', ln: 1, cn: 5},
    ]
    const i = 0
    const expectedNote: Note = {
      startLn: 1,
      startCn: 1,
      pitch: 'd',
      accidental: '-',
      noteValue: 16,
      dotted: false,
    }
    const expected: [Note | null, number] = [expectedNote, i + 4]
    expect(eatNote(chars, i)).toStrictEqual(expected)
  })

  test('When "e8.2" is found, it eats "e8.".', () => {
    const chars = [
      {c: 'e', ln: 1, cn: 1},
      {c: '8', ln: 1, cn: 2},
      {c: '.', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
    ]
    const i = 0
    const expectedNote: Note = {
      startLn: 1,
      startCn: 1,
      pitch: 'e',
      accidental: null,
      noteValue: 8,
      dotted: true,
    }
    const expected: [Note | null, number] = [expectedNote, i + 3]
    expect(eatNote(chars, i)).toStrictEqual(expected)
  })

  test('When "f=32.." is found, it eats "f=32.".', () => {
    const chars = [
      {c: 'f', ln: 1, cn: 1},
      {c: '=', ln: 1, cn: 2},
      {c: '3', ln: 1, cn: 3},
      {c: '2', ln: 1, cn: 4},
      {c: '.', ln: 1, cn: 5},
      {c: '.', ln: 1, cn: 6},
    ]
    const i = 0
    const expectedNote: Note = {
      startLn: 1,
      startCn: 1,
      pitch: 'f',
      accidental: '=',
      noteValue: 32,
      dotted: true,
    }
    const expected: [Note | null, number] = [expectedNote, i + 5]
    expect(eatNote(chars, i)).toStrictEqual(expected)
  })

  test('When a note spanning multiple lines is found, it returns the note found on the same line and the index of the next line character.', () => {
    const chars = [
      {c: 'f', ln: 1, cn: 1},
      {c: '=', ln: 1, cn: 2},
      {c: '3', ln: 1, cn: 3},
      {c: '2', ln: 2, cn: 1},
      {c: '.', ln: 2, cn: 2},
    ]
    const i = 0
    const expectedNote: Note = {
      startLn: 1,
      startCn: 1,
      pitch: 'f',
      accidental: '=',
      noteValue: 3,
      dotted: false,
    }
    const expected: [Note | null, number] = [expectedNote, i + 3]
    expect(eatNote(chars, i)).toStrictEqual(expected)
  })
})
