import { expect } from 'chai'

// local import
import SevenSegmentSearch, {
  reduceSpace,
  getPossibleSols,
  getDigit
} from './seven-segment-search.js'

// Example given from the question
const ONE_LINE_SAMPLE =
  'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf'

const TEST_SAMPLE = [
  'be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe',
  'edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc',
  'fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg',
  'fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb',
  'aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea',
  'fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb',
  'dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe',
  'bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef',
  'egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb',
  'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce'
]

describe('Day 08 - Seven Segment Search', () => {
  describe('Part I', () => {
    it('test TEST_SAMPLE for part one works', () => {
      const cnt = SevenSegmentSearch.cntOutputUniqueValue(TEST_SAMPLE)
      expect(cnt).eq(26)
    })
  })

  describe('Part II', () => {
    it('test for SSS reduceSpace()', () => {
      const input = ['a', 'bc', 'bc', 'acde']
      const result = reduceSpace(input, 1, 'b')
      expect(result).eql(['a', 'b', 'c', 'acde'])
    })

    it('test for SSS getPossibleSols()', () => {
      const space1 = ['ab', 'cd']
      expect(getPossibleSols(space1)).eql([
        ['a', 'c'],
        ['a', 'd'],
        ['b', 'c'],
        ['b', 'd']
      ])
    })

    it('test for SSS getDigit()', () => {
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
      const config = ['d', 'e', 'a', 'f', 'g', 'b', 'c']
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
      expect(getDigit(config, noVal)).be.null
    })

    it('test solveSevenSegmentSearch', () => {
      const ss = SevenSegmentSearch.solveSevenSegment(ONE_LINE_SAMPLE)
      console.log(ss)
    })
  })
})
