import { expect } from 'chai'

// local import
import SevenSegmentSearch from './seven-segment-search.js'

// Example given from the question
const ONE_LINE_SAMPLE = 'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf'

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
  'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce',
]

describe('Day 08 - Seven Segment Search', () => {
  describe('Part I', () => {
    it('test TEST_SAMPLE for part one works', () => {
      const cnt = SevenSegmentSearch.cntOutputUniqueValue(TEST_SAMPLE)
      expect(cnt).eq(26)
    })
  })

  describe('Part II', () => {
    it('test solveSevenSegmentSearch', () => {
      const ss = SevenSegmentSearch.solveSevenSegment(ONE_LINE_SAMPLE)
      console.log(ss)
    })
  })
})
