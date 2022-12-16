const UNIQ_CNTS = [2, 3, 4, 7]

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
}

export { SevenSegmentSearch as default }
