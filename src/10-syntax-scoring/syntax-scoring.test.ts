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
    { result: 'incomplete', char: '}}]])})]', score: 288957 },
    { result: 'incomplete', char: ')}>]})', score: 5566 },
    { result: 'corrupted', char: '}', score: 1197 },
    { result: 'incomplete', char: '}}>}>))))', score: 1480781 },
    { result: 'corrupted', char: ')', score: 3 },
    { result: 'corrupted', char: ']', score: 57 },
    { result: 'incomplete', char: ']]}}]}]}>', score: 995444 },
    { result: 'corrupted', char: ')', score: 3 },
    { result: 'corrupted', char: '>', score: 25137 },
    { result: 'incomplete', char: '])}>', score: 294 },
  ],
  syntaxErrorScore: 26397,
  middleIncompleteScore: 288957
}

describe('Day 10 - Syntax Scoring', () => {
  describe('Part I', () => {
    it('syntax-scoring analysis for corrupted cases are correct for TEST_SAMPLE', () => {
      TEST_SAMPLE.input.forEach((ln, idx) => {
        const analysis = SyntaxScoring.analyseOneLine(ln)
        if (analysis.result !== 'corrupted') return

        expect(analysis).eql(TEST_SAMPLE.analyses[idx])
      })
    })

    it('syntax-scoring is computed correctly for TEST_SAMPLE', () => {
      expect(SyntaxScoring.totalSyntaxErrorScore(TEST_SAMPLE.input)).eq(
        TEST_SAMPLE.syntaxErrorScore
      )
    })
  })

  describe('Part II', () => {
    it('syntax-scoring analysis for incomplete cases are correct for TEST_SAMPLE', () => {
      TEST_SAMPLE.input.forEach((ln, idx) => {
        const analysis = SyntaxScoring.analyseOneLine(ln)
        if (analysis.result !== 'incomplete') return

        expect(analysis).eql(TEST_SAMPLE.analyses[idx])
      })
    })

    it('syntax-scoring middle-incomplete-score is computed correctly for TEST_SAMPLE', () => {
      expect(SyntaxScoring.middleIncompleteScore(TEST_SAMPLE.input)).eq(
        TEST_SAMPLE.middleIncompleteScore
      )
    })
  })
})
