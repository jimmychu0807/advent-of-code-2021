type TwoValTuple = [number, number | undefined]

class SonarSweep {
  input: number[]

  constructor(input: number[]) {
    this.input = input
  }

  countIncreasing(): number {
    // Count the increasing depth from the input.
    // If the currentVal is larger than the prevVal, increment by 1.
    // memo[0] stores the cnt, memo[1] stores the previous value to be passed to the next call
    const result = this.input.reduce(
      (memo, val): TwoValTuple => {
        if (typeof memo[1] === 'undefined') return [0, val]
        if (val > memo[1]) return [(memo[0] as number) + 1, val]
        return [memo[0], val]
      },
      [0, undefined] as TwoValTuple
    )

    return result[0] as number
  }
}

export default SonarSweep
