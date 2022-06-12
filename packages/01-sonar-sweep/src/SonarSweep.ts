import { isNotNullOrUndefined } from '@aoc-2021/utils'

interface CountDeltaType {
  increasing: number
  noChange: number
  decreasing: number
}

type TwoValTuple = [CountDeltaType, number | undefined]

class SonarSweep {
  input: number[]

  constructor(input: number[]) {
    this.input = input
  }

  count(windowWidth = 1): CountDeltaType {
    // Grouping input into the window
    const datInWindow = this.inputGroupByWindow(windowWidth)

    // Count the delta of depth from the input.
    // If the currentVal is larger than the prevVal, increment by 1.
    // memo[0] stores the cnt, memo[1] stores the previous value to be passed to the next call
    const result = datInWindow.reduce(
      ([cntObj, prev], current): TwoValTuple => {
        if (typeof prev === 'undefined') return [cntObj, current] as TwoValTuple

        if (current > prev) {
          return [Object.assign(cntObj, { increasing: cntObj.increasing + 1 }), current]
        } else if (current < prev) {
          return [Object.assign(cntObj, { decreasing: cntObj.decreasing + 1 }), current]
        } else {
          return [Object.assign(cntObj, { noChange: cntObj.noChange + 1 }), current]
        }
      },
      [{ increasing: 0, noChange: 0, decreasing: 0 }, undefined] as TwoValTuple
    )

    return result[0]
  }

  private inputGroupByWindow(windowWidth: number): number[] {
    const data = this.input
      .map((_val, ind, arr) => {
        if (ind + windowWidth > arr.length) return null
        return arr.slice(ind, ind + windowWidth).reduce((memo, val) => memo + val, 0)
      })
      .filter(isNotNullOrUndefined)

    return data
  }
}

export { SonarSweep as default, SonarSweep, CountDeltaType }
