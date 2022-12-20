import { expect } from 'chai'

import SyntaxScoring from './syntax-scoring.js'

// prettier-ignore
const TEST_SAMPLE = {
  input: [
    '[({(<(())[]>[[{[]{<()<>>',
    '[(()[<>])]({[<{<<[]>>(',
    '{([(<{}[<>[]}>{[]{[(<()>',
    '(((({<>}<{<{<>}{[]{[]{}',
    '[[<[([]))<([[{}[[()]]]',
    '[{[{({}]{}}([{[{{{}}([]',
    '{<[[]]>}<{[{[{[]{()[[[]',
    '[<(<(<(<{}))><([]([]()',
    '<{([([[(<>()){}]>(<<{{',
    '<{([{{}}[<[[[<>{}]]]>[]]',
  ],
  analyses: [
    { result: 'incomplete', char: '' },
    { result: 'incomplete', char: '' },
    { result: 'corrupted', char: '}' },
    { result: 'incomplete', char: '' },
    { result: 'corrupted', char: ')' },
    { result: 'corrupted', char: ']' },
    { result: 'incomplete', char: '' },
    { result: 'corrupted', char: ')' },
    { result: 'corrupted', char: '>' },
    { result: 'incomplete', char: '' },
  ],
  syntaxErrorScore: 26397
}

describe('Day 10 - Syntax Scoring', () => {
  describe('Part I', () => {
    it('analysis is correct for TEST_SAMPLE', () => {
      TEST_SAMPLE.input.forEach((ln, idx) => {
        expect(SyntaxScoring.analyseOneLine(ln)).eql(TEST_SAMPLE.analyses[idx])
      })
    })

    it('syntax score is computed correctly for TEST_SAMPLE', () => {
      expect(SyntaxScoring.totalSyntaxErrorScore(TEST_SAMPLE.input)).eq(
        TEST_SAMPLE.syntaxErrorScore
      )
    })
  })

  describe('Part II', () => {
    it('pending test')
  })
})
