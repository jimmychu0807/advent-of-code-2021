'use struct'
import Debug from 'debug'
import * as fs from 'fs/promises'
import type { WriteStream } from 'fs'

const log = {
  info: Debug('latternfish:info'),
  debug: Debug('latternfish:debug')
}

interface LatternfishConfig {
  fishes: Uint8Array | Array<number>
  dayToSpawn: number
  initDayToSpawn: number
}

const MAX_BUFFER_LEN = 2**32 - 1

// opt 1: use Uint8Array
// opt 2: write to two tmp files

class Latternfish {

  static async modeling(config: LatternfishConfig, days: number): Promise<number> {
    // Using dynamic import here to load es-module in commonjs
    const { temporaryFile } = await import('tempy')

    const { fishes,  dayToSpawn, initDayToSpawn } = config
    let result = Uint8Array.of(...fishes)

    let resultFilePath = temporaryFile()
    let spawnFilePath = temporaryFile()
    let tmpFilePath = temporaryFile()

    log.info(`resultFilePath: ${resultFilePath}`)
    log.info(`spawnFilePath: ${spawnFilePath}`)
    log.info(`tmpFilePath: ${tmpFilePath}`)
    log.debug(dayToSpawn, initDayToSpawn)

    let resultfh = await (fs.open(resultFilePath, 'rw'))
    await resultfh.write(result)

    for (let day = 0; day < days; day++) {

      let resultReadStream = (await (fs.open(resultFilePath, 'r'))).createReadStream({ encoding: 'ascii', })
      let tmpWriteStream = (await (fs.open(tmpFilePath, 'w'))).createWriteStream({ encoding: 'ascii' })
      let spawnWriteStream = (await (fs.open(spawnFilePath, 'w'))).createWriteStream({ encoding: 'ascii' })

      let readingResult = true
      while(readingResult) {
        resultReadStream.on('data', chunk => {
          tmpWriteStream.write(chunk)
          spawnWriteStream.write(chunk)
        })

        resultReadStream.on('end', () => {
          readingResult = false
        })
      }
      await Promise.allSettled([
        closeStream(tmpWriteStream),
        closeStream(spawnWriteStream)
      ])

      // TODO: Merge tmpFilePath and spawnFilePath and write to resultFilePath
    }

    // TODO: Count the fishes in resultFilePath

    return 0
  }
}

async function closeStream(writeStream: WriteStream) {
  return new Promise<void>((resolve, reject) => {
    writeStream.close((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
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
