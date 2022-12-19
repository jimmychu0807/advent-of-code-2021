import { CoordinateRC } from '../utils/index.js'

interface Point {
  loc: CoordinateRC
  value: number
}

type NumberOrUndefined = number | undefined

const toBasinMap = (input: string[]): number[][] =>
  input.map((ln) => ln.split('').map((c) => Number(c)))

function initScanColor(): () => number {
  let scanColor = 0
  return (): number => scanColor++
}

class SmokeBasin {
  static getLowPoints(input: string[]): Point[] {
    const basin: number[][] = toBasinMap(input)
    const lowPts: Point[] = []

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
          lowPts.push({ value, loc: new CoordinateRC(rowIdx, colIdx) })
        }
      })
    })

    return lowPts
  }

  static getTotalRiskLevel(input: string[]): number {
    const lowPts = this.getLowPoints(input)
    return lowPts.reduce((memo, el) => memo + el.value, lowPts.length)
  }

  static scanBasin(input: string[]): NumberOrUndefined[][] {
    const basin: number[][] = toBasinMap(input)
    const lowPts = this.getLowPoints(input)

    const basinHeight = basin.length
    const basinWidth = basin[0]?.length as number
    const nextScanColor = initScanColor()

    // Initialize basinScanMap
    const basinScanMap: NumberOrUndefined[][] = Array(basinHeight)
      .fill(0)
      .map(() => Array(basinWidth).fill(undefined))

    lowPts.forEach((pt) => {
      ;(basinScanMap[pt.loc.row] as number[])[pt.loc.col] = nextScanColor()
    })

    let expanded = true
    while (expanded) {
      expanded = false

      basin.forEach((row, rowIdx) => {
        row.forEach((value, colIdx) => {
          if (basinScanMap[rowIdx]?.[colIdx] !== undefined) return

          // prettier-ignore
          if (colIdx !== 0  && value !== 9 // check left
            && basinScanMap[rowIdx]?.[colIdx - 1] !== undefined
            && (basin[rowIdx]?.[colIdx] || 0) > (basin[rowIdx]?.[colIdx - 1] || 0)
          ) {
            (basinScanMap[rowIdx] as NumberOrUndefined[])[colIdx] = basinScanMap[rowIdx]?.[colIdx - 1]
            expanded = true
          }

          // prettier-ignore
          if (colIdx !== basinWidth - 1 && value !== 9 // check right
            && basinScanMap[rowIdx]?.[colIdx + 1] !== undefined
            && (basin[rowIdx]?.[colIdx] || 0) > (basin[rowIdx]?.[colIdx + 1] || 0)
          ) {
            (basinScanMap[rowIdx] as NumberOrUndefined[])[colIdx] = basinScanMap[rowIdx]?.[colIdx + 1]
            expanded = true
          }

          // prettier-ignore
          if (rowIdx !== 0 && value !== 9 // check above
            && basinScanMap[rowIdx - 1]?.[colIdx] !== undefined
            && (basin[rowIdx]?.[colIdx] || 0) > (basin[rowIdx - 1]?.[colIdx] || 0)
          ) {
            (basinScanMap[rowIdx] as NumberOrUndefined[])[colIdx] = basinScanMap[rowIdx - 1]?.[colIdx]
            expanded = true
          }

          // prettier-ignore
          if (rowIdx !== basinHeight - 1 && value !== 9 // check below
            && basinScanMap[rowIdx + 1]?.[colIdx] !== undefined
            && (basin[rowIdx]?.[colIdx] || 0) > (basin[rowIdx + 1]?.[colIdx] || 0)
          ) {
            (basinScanMap[rowIdx] as NumberOrUndefined[])[colIdx] = basinScanMap[rowIdx + 1]?.[colIdx]
            expanded = true
          }
        })
      })
    }

    return basinScanMap
  }

  static threeLargestBasinSizeProduct(input: string[]): number {
    const basinScanMap = this.scanBasin(input)
    const basinSizes = []

    let findNextBasinSize = true
    let basinColor = 0

    while (findNextBasinSize) {
      findNextBasinSize = false
      const size = basinScanMap.flat().filter((el) => el === basinColor).length

      if (size > 0) {
        basinSizes[basinColor] = size
        findNextBasinSize = true
        basinColor++
      }
    }

    const sorted = basinSizes.sort((a, b) => b - a)
    return (sorted[0] as number) * (sorted[1] as number) * (sorted[2] as number)
  }
}

export { SmokeBasin as default }
