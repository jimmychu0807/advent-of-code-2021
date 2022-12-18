import Debug from 'debug'

const log = {
  info: Debug('sss'),
  infoRecursion: Debug('sss:recursion')
}

const UNIQ_CNTS = [2, 3, 4, 7]

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
  9: newSet([0, 1, 2, 3, 5, 6])
}

const initSegmentSpace = (): Array<string> => Array(7).fill('abcdefg')
const isSolved = (segmentSpace: string[]): boolean => segmentSpace.every((seg) => seg.length === 1)

// Remove all characters in `chars` from `str`.
const removeChars = (str: string, chars: string): string =>
  chars.split('').reduce((memo: string, c: string) => memo.replaceAll(c, ''), str)

const intersectionChars = (str: string, chars: string): string =>
  chars
    .split('')
    .reduce((memo: string, c: string) => (str.indexOf(c) >= 0 ? memo.concat(c) : memo), '')

function newSet<T>(arr: T[]): Set<T> {
  return arr.reduce((memo: Set<T>, el: T) => memo.add(el), new Set())
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
    throw new Error(
      `Unexpected word: ${word} for easy cases. Word should have length of 2, 3, or 4`
    )
  }
}

const reduceSpace = (space: string[], idx: number, c: string): string[] =>
  space.map((str, i) => (i === idx ? c : removeChars(str, c)))

function getPossibleSols(space: string[]): string[][] {
  log.infoRecursion('space:', space)

  if (isSolved(space)) return [space]

  let result: string[][] = []
  for (let segmentIdx = 0; segmentIdx < space.length; segmentIdx++) {
    if ((space[segmentIdx] as string).length > 1) {
      space[segmentIdx]?.split('').forEach((c) => {
        const reduced = reduceSpace([...space], segmentIdx, c)
        const possible = getPossibleSols(reduced)
        result = possible.reduce(
          (memo, one) =>
            // They are two arraies, so we do a join() op to stringify them.
            // Before merging the result, we check if it existed already.
            memo.find((el) => el.join('') === one.join('')) ? memo : memo.concat([one]),
          result
        )
      })
    }
  }

  log.infoRecursion('returning result:', result)
  return result
}

function diffSet<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return [...setB].reduce((memo, el) => {
    memo.has(el) ? memo.delete(el) : memo.add(el)
    return memo
  }, new Set(setA))
}

function getDigit(config: string[], subject: string): number | null {
  const reverseLookup: { [key: string]: number } = {}
  config.forEach((val, idx) => (reverseLookup[val] = idx))

  const reverseSubjectSet: Set<number> = newSet(
    subject.split('').map((c) => reverseLookup[c] as number)
  )

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

      const outputTokens = backPath
        .trim()
        .split(' ')
        .map((v) => v.trim())
      const cnt = outputTokens
        .map((t) => t.length)
        .filter((val) => UNIQ_CNTS.indexOf(val) >= 0).length

      return memo + cnt
    }, 0)

    return totalCnt
  }

  static solveConfig(input: string): Array<string> | null {
    let segmentSpace: Array<string> = initSegmentSpace()

    // Also sort the word content on the line of `.split('').sort().join('')`.
    const words: Set<string> = newSet(
      input
        .split('|')
        .map((phrase) => phrase.split(' '))
        .flat()
        .filter((w) => w.length > 0)
        .map((w) => w.trim()) as string[]
    )
    log.info('words provided:', words)

    // let's go for the easy cases first, (len of 2, 3, 4)
    ;[...words]
      .filter((w) => w.length === 2 || w.length === 3 || w.length === 4)
      .forEach((word) => processEasyCases(segmentSpace, word))

    if (isSolved(segmentSpace)) return segmentSpace

    // These are hard cases, and do a brute force search below
    const subjects = [...words].reduce(
      (memo: Set<string>, w: string) => (w.length === 5 || w.length === 6 ? memo.add(w) : memo),
      new Set()
    )

    const pSols = getPossibleSols(segmentSpace)

    for (let idx = 0; idx < pSols.length; idx++) {
      if ([...subjects].every((subject) => getDigit(pSols[idx] || [], subject) !== null)) {
        segmentSpace = pSols[idx] as string[]
        break
      }
    }

    return isSolved(segmentSpace) ? segmentSpace : null
  }

  static getDigitsFromLine(input: string): number {
    const solvedConfig = this.solveConfig(input)
    if (solvedConfig === null) throw new Error(`Unsolvable segment config from: ${input}`)

    const lastPart = (input.split('|')[1] as string)
      .split(' ')
      .map((w) => w.trim())
      .filter((w) => w.length > 0)

    const digitArr = lastPart.map((str) => getDigit(solvedConfig, str))
    if (digitArr.some((d) => d === null)) throw new Error(`Contain unsolvable digit segment.`)

    return Number(digitArr.join(''))
  }

  static getSumFromMultilineInput(input: string[]): number {
    const values = input.map((ln) => this.getDigitsFromLine(ln))
    return values.reduce((memo, val) => memo + val, 0)
  }
}

export { SevenSegmentSearch as default, reduceSpace, getPossibleSols, getDigit }