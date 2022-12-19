import { expect } from 'chai'

// local import
import SevenSegmentSearch, { getDigit, permutate } from './seven-segment-search.js'

// Example given from the question
const ONE_LINE_SAMPLE = {
  input: 'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf',
  configSol: 'deafgbc',
  digits: 5353
}

const TEST_SAMPLE = [
  {
    input: 'be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe',
    digits: 8394
  },
  {
    input: 'edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc',
    digits: 9781
  },
  {
    input: 'fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg',
    digits: 1197
  },
  {
    input: 'fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb',
    digits: 9361
  },
  {
    input: 'aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea',
    digits: 4873
  },
  {
    input: 'fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb',
    digits: 8418
  },
  {
    input: 'dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe',
    digits: 4548
  },
  {
    input: 'bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef',
    digits: 1625
  },
  {
    input: 'egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb',
    digits: 8717
  },
  {
    input: 'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce',
    digits: 4315
  }
]

const TEST_SAMPLE_INPUT = TEST_SAMPLE.map((en) => en.input)

describe('Day 08 - Seven Segment Search', () => {
  describe('Part I', () => {
    it('test TEST_SAMPLE for part one works', () => {
      const cnt = SevenSegmentSearch.cntOutputUniqueValue(TEST_SAMPLE_INPUT)
      expect(cnt).eq(26)
    })
  })

  describe('Part II', () => {
    it('test SSS permutate()', () => {
      expect(permutate('abc')).to.eql(new Set(['abc', 'acb', 'bac', 'bca', 'cab', 'cba']))
      expect(permutate('abcd')).to.eql(
        // prettier-ignore
        new Set([
          'abcd', 'abdc', 'acbd', 'acdb', 'adcb', 'adbc',
          'bacd', 'badc', 'bcad', 'bcda', 'bdac', 'bdca',
          'cabd', 'cadb', 'cbad', 'cbda', 'cdab', 'cdba',
          'dabc', 'dacb', 'dbac', 'dbca', 'dcab', 'dcba',
        ])
      )
    })

    it('test SSS getDigit()', () => {
      // 7-segment display:
      //       0                d
      //     ────             ────
      //   1│    │2         e│    │a
      //    │  3 │           │  f │
      //     ────             ────
      //    │    │           │    │
      //   4│    │5         g│    │b
      //     ────             ────
      //       6                c
      const config = 'deafgbc'
      const one1 = 'ab'
      const one2 = 'ba'
      const two = 'cgfad'
      const three = 'dafbc'
      const four = 'efab'
      const five = 'defbc'
      const six = 'defgbc'
      const seven = 'dab'
      const eight = 'deafgbc'
      const nine = 'deafbc'
      const zero = 'deagbc'
      const noVal = 'egc'

      expect(getDigit(config, one1)).eq(1)
      expect(getDigit(config, one2)).eq(1)
      expect(getDigit(config, two)).eq(2)
      expect(getDigit(config, three)).eq(3)
      expect(getDigit(config, four)).eq(4)
      expect(getDigit(config, five)).eq(5)
      expect(getDigit(config, six)).eq(6)
      expect(getDigit(config, seven)).eq(7)
      expect(getDigit(config, eight)).eq(8)
      expect(getDigit(config, nine)).eq(9)
      expect(getDigit(config, zero)).eq(0)
      expect(getDigit(config, noVal)).be.undefined
    })

    it('test SSS solveConfig() with ONE_LINE_SAMPLE', () => {
      const sol = SevenSegmentSearch.solveConfig(ONE_LINE_SAMPLE.input)
      expect(sol).to.eq(ONE_LINE_SAMPLE.configSol)
    })

    it('test SSS getDigitsFromLine()', () => {
      const digits1 = SevenSegmentSearch.getDigitsFromLine(ONE_LINE_SAMPLE.input)
      expect(digits1).eq(ONE_LINE_SAMPLE.digits)

      TEST_SAMPLE.forEach(({ input, digits }) => {
        const result = SevenSegmentSearch.getDigitsFromLine(input)
        expect(result).eq(digits)
      })
    })

    it('test SSS getSumFromMultilineInput()', () => {
      const sum = SevenSegmentSearch.getSumFromMultilineInput(TEST_SAMPLE_INPUT)
      expect(sum).eq(61229)
    })
  })
})
