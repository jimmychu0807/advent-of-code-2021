import Debug from 'debug'

const log = {
  info: Debug('trecheryOfWhales')
}

type TDistCal = 'normal' | 'incremental'

interface Config {
  input: number[] | string
  distCal: TDistCal
}

function parseConfig(config: Config): number[] {
  const { input } = config
  if (typeof input === 'string') return input.split(',').map((v) => Number(v.trim()))
  return input
}

function findMinMax(inputNums: number[]): [number, number] {
  let min: number = inputNums[0] as number
  let max: number = inputNums[0] as number

  for (let i = 1; i < inputNums.length; i++) {
    if ((inputNums[i] as number) < min) {
      min = inputNums[i] as number
    } else if ((inputNums[i] as number) > max) {
      max = inputNums[i] as number
    }
  }

  return [min, max]
}

function arithmeticSeries(val: number): number {
  // ref: https://en.wikipedia.org/wiki/Arithmetic_progression
  return ((1 + val) * val) / 2
}

function identity(val: number): number {
  return val
}

function getDistance(inputNums: number[], pivot: number, distCal: TDistCal): number {
  const apply = distCal === 'normal' ? identity : arithmeticSeries
  return inputNums.reduce((memo, input) => memo + apply(Math.abs(input - pivot)), 0)
}

class TrecheryOfWhales {
  static getMinFuelPos(config: Config): [number, number] {
    const inputNums: number[] = parseConfig(config)
    const { distCal } = config

    log.info(`input: ${inputNums}`)

    if (inputNums.length <= 1) throw new Error('input has to have at least two numbers')

    const [min, max] = findMinMax(inputNums)

    log.info(`min: ${min}, max: ${max}`)

    const range: number[] = []
    for (let i = min; i <= max; i++) {
      range.push(i)
    }

    let minPos: number | undefined
    let minDist: number | undefined

    const rangeDistance: [number, number][] = range.map((r) => [
      r,
      getDistance(inputNums, r, distCal)
    ])

    log.info(rangeDistance)

    rangeDistance.forEach(([pos, dist]: [number, number]) => {
      if (minDist === undefined || dist < minDist) {
        minPos = pos
        minDist = dist
      }
    })

    return [minPos as number, minDist as number]
  }
}

export { TrecheryOfWhales as default, Config }
