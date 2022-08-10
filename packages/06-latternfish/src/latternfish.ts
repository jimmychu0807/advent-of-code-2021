'use struct'
import Debug from 'debug'

const log = {
  info: Debug('latternfish:info'),
  debug: Debug('latternfish:debug')
}

interface LatternfishConfig {
  fishes: number[]
  dayToSpawn: number
  initDayToSpawn: number
}

const MAX_ARRAY_SIZE = 2**26 - 1

log.info(`default max array length: ${MAX_ARRAY_SIZE}`)

class Latternfish {
  static modeling(config: LatternfishConfig, days: number): number[][] {
    const { fishes, dayToSpawn, initDayToSpawn } = config
    let result = [[...fishes]]

    for (let day = 0; day < days; day++) {

      let newSpawns: number[][] = [[]]

      result.forEach(row => {
        for (let idx = 0; idx < row.length; idx++) {
          if (row[idx] as number > 0) {
            row[idx] -= 1
          } else {
            row[idx] = dayToSpawn
            newSpawns = pushEl(newSpawns, initDayToSpawn)
          }
        }
      })

      log.debug(`[day ${day}: beforeMerge] result: [${result.length}, ${Latternfish.countFishes(result)}], newSpawns: [${newSpawns.length}, ${Latternfish.countFishes(newSpawns)}]`)
      result = merge(result, newSpawns)
      log.info(`[day ${day}: afterMerge] result: [${result.length}, ${Latternfish.countFishes(result)}]`)
      log.debug(result)
    }

    return result
  }

  static countFishes(fishes: number[][]): BigInt {
    return fishes.map(row => BigInt(row.length))
      .reduce((memo, val) => memo + val, 0n)
  }
}

function pushEl(arrOfArr: number[][], el: number, maxArrLen: number = MAX_ARRAY_SIZE): number[][] {
  const lastRow = arrOfArr.length - 1
  if ((arrOfArr[lastRow] as number[]).length < maxArrLen) {
    (arrOfArr[lastRow] as number[]).push(el)
  } else {
    if (arrOfArr.length === maxArrLen) {
      throw new Error('Array exceeds expected capacity')
    }
    arrOfArr.push([el])
  }

  return arrOfArr
}

function merge(target: number[][], src: number[][], maxArrLen: number = MAX_ARRAY_SIZE): number[][] {
  // pop the last rows of two structures
  const lastTargetRow = target.pop() as number[]
  const lastSrcRow = src.pop() as number[]

  // simply merge everything above for the two structures
  target = target.concat(src)

  const lastRows = lastTargetRow.length + lastSrcRow.length <= maxArrLen
    ? [lastTargetRow.concat(lastSrcRow)]
    : [
        lastTargetRow.concat(lastSrcRow.slice(0, maxArrLen - lastTargetRow.length)),
        lastSrcRow.slice(maxArrLen - lastTargetRow.length)
      ]

  if (target.length + lastRows.length > maxArrLen) {
    throw new Error('Target array exceeds expected capacity')
  }

  target = target.concat(lastRows)
  return target
}

export { Latternfish as default, Latternfish, LatternfishConfig, pushEl, merge }
