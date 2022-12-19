class SmokeBasin {
  static getLowPoints(input: string[]): number[] {
    const basin: number[][] = input.map((ln) => ln.split('').map((c) => Number(c)))
    const lowPts: number[] = []

    const colMaxIdx = (basin[0] as number[]).length - 1
    const rowMaxIdx = basin.length - 1

    basin.forEach((row, rowIdx) => {
      row.forEach((value, colIdx) => {
        // prettier-ignore
        if (
          (rowIdx === 0 || basin[rowIdx - 1]?.[colIdx] as number > value) &&
          (colIdx === 0 || basin[rowIdx]?.[colIdx - 1] as number > value) &&
          (rowIdx === rowMaxIdx || basin[rowIdx + 1]?.[colIdx] as number > value) &&
          (colIdx === colMaxIdx || basin[rowIdx]?.[colIdx + 1] as number > value)
        ) {
          lowPts.push(value)
        }
      })
    })

    return lowPts
  }

  static getTotalRiskLevel(input: string[]): number {
    const lowPts = this.getLowPoints(input)
    return lowPts.reduce((memo, el) => memo + el, lowPts.length)
  }
}

export { SmokeBasin as default }
