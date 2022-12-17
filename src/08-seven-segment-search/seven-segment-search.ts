import Debug from 'debug'

const log = {
  info: Debug('sss')
}

const UNIQ_CNTS = [2, 3, 4, 7]

enum SearchState {
  Unprocessed = 0,
  EasyCasesProcessed,
  CaseOf5SProcessed,
  CaseOf6SProcessed,
}

const initSegmentSpace = (): Array<string> => Array(7).fill('abcdefg')
const isSolved = (segmentSpace: string[]): boolean => segmentSpace.every(seg => seg.length === 1)

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

// Remove all characters in `chars` from `str`.
const removeChars = (str: string, chars: string): string =>
  chars.split('').reduce((memo: string, c: string) => memo.replaceAll(c, ''), str)

const intersectionChars = (str: string, chars: string): string =>
  chars.split('').reduce((memo: string, c: string) => str.indexOf(c) >= 0 ? memo.concat(c) : memo, '')

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

  static solveSevenSegment(input: string): Array<string> {
    //     0
    //   ────
    // 1│    │2
    //  │  3 │
    //   ────
    //  │    │
    // 4│    │5
    //   ────
    //     6
    let segmentSpace: Array<string> = initSegmentSpace()
    let state: SearchState = SearchState.Unprocessed

    let words = input.split('|').map(phrase => phrase.split(' ').map(w => w.trim())).flat()
    log.info(words)

    while(!isSolved(segmentSpace) && state !== SearchState.CaseOf6SProcessed) {
      switch (state) {
      case SearchState.Unprocessed:
        // let's go for the easy cases first, (len of 2, 3, 4)
        words
          .filter(w => w.length === 2 || w.length === 3 || w.length === 4)
          .forEach(word => processEasyCases(segmentSpace, word))

        state = SearchState.EasyCasesProcessed
        break

      case SearchState.EasyCasesProcessed:
        state = SearchState.CaseOf5SProcessed
        break

      case SearchState.CaseOf5SProcessed:
        state = SearchState.CaseOf6SProcessed
        break
      }
    }

    return segmentSpace
  }
}

export { SevenSegmentSearch as default }
