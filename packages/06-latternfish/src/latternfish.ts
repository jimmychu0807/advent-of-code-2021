'use struct'
import Debug from 'debug'
import { temporaryFile } from 'tempy'

const log = {
  info: Debug('latternfish:info'),
  debug: Debug('latternfish:debug')
}

interface LatternfishConfig {
  fishes: Uint8Array | Array<number>
  dayToSpawn: number
  initDayToSpawn: number
}

const MAX_BUFFER_LEN = 2**31

// opt 1: use Uint8Array
// opt 2: write to two tmp files

class Latternfish {

  static modeling(config: LatternfishConfig, days: number): Uint8Array {
    const { fishes, dayToSpawn, initDayToSpawn } = config
    let result = Uint8Array.of(...fishes)

    for (let day = 0; day < days; day++) {

      let newSpawns = new Uint8Array(MAX_BUFFER_LEN)
      let spawnLen: number = 0

      for (let idx = 0; idx < result.length; idx++) {
        if (result[idx] as number > 0) {
          result[idx] -= 1
        } else {
          result[idx] = dayToSpawn
          // a new fish is spawn
          if (spawnLen >= MAX_BUFFER_LEN) {
            throw new Error(`fish spawn length exceeds ${MAX_BUFFER_LEN}`)
          }
          newSpawns[spawnLen] = initDayToSpawn
          spawnLen += 1
        }
      }

      result = mergeTypedArray(result, newSpawns, spawnLen)
      log.info(`[day ${day}] len: ${result.length}`)
    }

    return result
  }
}

function mergeTypedArray(arr1: Uint8Array, arr2: Uint8Array, arr2Len: number): Uint8Array {
  if (arr1.length + arr2Len > MAX_BUFFER_LEN) {
    throw new Error(
      `Sum of arr1 length: ${arr1.length} and arr2 length ${arr2.length} exceed ${MAX_BUFFER_LEN}`
    )
  }
  let result = new Uint8Array(arr1.length + arr2Len)
  result.set(arr1)
  result.set(arr2.slice(0, arr2Len), arr1.length)
  return result
}

export { Latternfish as default, Latternfish, LatternfishConfig, mergeTypedArray }
