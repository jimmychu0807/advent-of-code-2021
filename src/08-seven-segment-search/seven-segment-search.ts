import Debug from 'debug'

const log = {
  info: Debug('sss')
}

const UNIQ_CNTS = [2, 3, 4, 7]
const TOTAL_SEGMENTS = 7

// 7-segment display:
//       0
//     ────
//   1│    │2
//    │  3 │
//     ────
//    │    │
//   4│    │5
//     ────
//       6
const DIGIT_SEGMENTS = {
  0: newSet([0, 1, 2, 4, 5, 6]),
  1: newSet([2, 5]),
  2: newSet([0, 2, 3, 4, 6]),
  3: newSet([0, 2, 3, 5, 6]),
  4: newSet([1, 2, 3, 5]),
  5: newSet([0, 1, 3, 5, 6]),
  6: newSet([0, 1, 3, 4, 5, 6]),
  7: newSet([0, 2, 5]),
  8: newSet([0, 1, 2, 3, 4, 5, 6]),
  9: newSet([0, 1, 2, 3, 5, 6]),
}

const initSegmentSpace = (): Array<string> => Array(7).fill('abcdefg')
const isSolved = (segmentSpace: string[]): boolean => segmentSpace.every(seg => seg.length === 1)

// Remove all characters in `chars` from `str`.
const removeChars = (str: string, chars: string): string =>
  chars.split('').reduce((memo: string, c: string) => memo.replaceAll(c, ''), str)

const intersectionChars = (str: string, chars: string): string =>
  chars.split('').reduce((memo: string, c: string) => str.indexOf(c) >= 0 ? memo.concat(c) : memo, '')

function newSet<T>(arr: T[]): Set<T> {
  return arr.reduce(
    (memo: Set<T>, el: T) => memo.add(el),
    new Set()
  )
}

function processEasyCases(segmentSpace: string[], word: string): void {
  if (word.length === 2) {
    segmentSpace[0] = removeChars(segmentSpace[0] || '', word)
    segmentSpace[1] = removeChars(segmentSpace[1] || '', word)
    segmentSpace[2] = intersectionChars(segmentSpace[2] || '', word)
    segmentSpace[3] = removeChars(segmentSpace[3] || '', word)
    segmentSpace[4] = removeChars(segmentSpace[4] || '', word)
    segmentSpace[5] = intersectionChars(segmentSpace[5] || '', word)
    segmentSpace[6] = removeChars(segmentSpace[6] || '', word)
  } else if (word.length === 3) {
    segmentSpace[0] = intersectionChars(segmentSpace[0] || '', word)
    segmentSpace[1] = removeChars(segmentSpace[1] || '', word)
    segmentSpace[2] = intersectionChars(segmentSpace[2] || '', word)
    segmentSpace[3] = removeChars(segmentSpace[3] || '', word)
    segmentSpace[4] = removeChars(segmentSpace[4] || '', word)
    segmentSpace[5] = intersectionChars(segmentSpace[5] || '', word)
    segmentSpace[6] = removeChars(segmentSpace[6] || '', word)
  } else if (word.length === 4) {
    segmentSpace[0] = removeChars(segmentSpace[0] || '', word)
    segmentSpace[1] = intersectionChars(segmentSpace[1] || '', word)
    segmentSpace[2] = intersectionChars(segmentSpace[2] || '', word)
    segmentSpace[3] = intersectionChars(segmentSpace[3] || '', word)
    segmentSpace[4] = removeChars(segmentSpace[4] || '', word)
    segmentSpace[5] = intersectionChars(segmentSpace[5] || '', word)
    segmentSpace[6] = removeChars(segmentSpace[6] || '', word)
  } else {
    throw new Error(`Unexpected word: ${word} for easy cases. Word should have length of 2, 3, or 4`)
  }
}

function reduceSpace(space: string[], idx: number, c: string): string[] {
  space[idx] = c
  for (const i = 0; i < TOTAL_SEGMENTS; i++) {
    if (i === idx) break
    removeChars(space[i], c)
  }
  return space
}

function getPossibleSols(space: string[]): string[][] {
  let result: string[][] = []
  for(let segment = 0; segment < TOTAL_SEGMENTS; segment++) {
    if (space[segment].length > 0) {
      space[segment].split('').forEach((c, idx) => {
        result = result.concat(getPossibleSols(reduceSpace([...space], idx, c)))
      })
    }
  }

  return result
}

function diffSet(setA: Set<number>, setB: Set<number>): Set<number> {
  const diff = new Set(setA)
  for (const el of setB) {
    diff.has(el) ? diff.delete(el) : diff.add(el)
  }
  return diff
}

function getDigit(config: string[], subject: string): number | null {
  let reverseLookup: {[key: string]: number} = {}
  config.forEach((val, idx) => reverseLookup[val] = idx)

  let reverseSubjectSet = newSet(subject.split('').map(c => reverseLookup[c]))

  let digit: number | null = null

  for (const [key, segment] of Object.entries(DIGIT_SEGMENTS)) {
    if (diffSet(segment, reverseSubjectSet).size === 0) {
      digit = Number(key)
      break
    }
  }

  return digit
}

class SevenSegmentSearch {
  static cntOutputUniqueValue(input: string[]): number {
    const totalCnt = input.reduce((memo: number, line: string) => {

      const backPath = line.split('|')[1]
      if (backPath === undefined) return 0

      const outputTokens = backPath.trim().split(' ').map(v => v.trim())
      const cnt = outputTokens
        .map(t => t.length)
        .filter(val => UNIQ_CNTS.indexOf(val) >= 0)
        .length

      return memo + cnt
    }, 0)

    return totalCnt
  }

  static solveSevenSegment(input: string): Array<string> | null {
    let segmentSpace: Array<string> = initSegmentSpace()

    // Also sort the word content on the line of `.split('').sort().join('')`.
    const words = input
      .split('|')
      .map(phrase => phrase.split(' ').filter(w => w.length > 0).map(w =>
        w.trim().split('').sort().join('')
      ))
      .flat()

    log.info(words)

    // let's go for the easy cases first, (len of 2, 3, 4)
    words
      .filter(w => w.length === 2 || w.length === 3 || w.length === 4)
      .forEach(word => processEasyCases(segmentSpace, word))

    if (isSolved(segmentSpace)) return segmentSpace

    // These are hard cases, and do a brute force search below
    const subjects = words.reduce(
      (memo: Set<string>, w: string) =>
        (w.length === 5 || w.length === 6) ? memo.add(w) : memo,
      new Set()
    )

    const pSols = getPossibleSols(segmentSpace)

    for (let idx = 0; idx < pSols.length; idx++) {
      if ([...subjects].every(subject => getDigit(pSols[idx], subject) !== null)) {
        segmentSpace = pSols[idx]
        break
      }
    }

    return isSolved(segmentSpace) ? segmentSpace : null
  }
}

export { SevenSegmentSearch as default }
