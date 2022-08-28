'use struct'
import Debug from 'debug'
import * as fsPromise from 'fs/promises'
import * as fs from 'fs'

const log = {
  info: Debug('latternfish'),
}

interface LatternfishConfig {
  fishes: Uint8Array | Array<number>
  dayToSpawn: number
  initDayToSpawn: number
  daySimulation: number
}

// const CHUNK_SIZE = 50*1024*1024
const CHUNK_SIZE = 10*1024*1024

// opt 1: use Uint8Array
// opt 2: write to two tmp files

class Latternfish {

  static keepTmpFiles = true

  static async modeling(config: LatternfishConfig): Promise<number> {
    // Using dynamic import here to load es-module in commonjs
    const { temporaryFile } = await import('tempy')

    const { fishes,  dayToSpawn, initDayToSpawn, daySimulation } = config
    let result = Uint8Array.of(...fishes)
    let tmpFiles: string[] = []

    let resultFilePath = temporaryFile()
    tmpFiles.push(resultFilePath)

    await fsPromise.writeFile(resultFilePath, result.join(''))

    for (let i = 0; i < daySimulation; i++) {
      resultFilePath = await this.modelForOneDay(resultFilePath, dayToSpawn, initDayToSpawn)
      tmpFiles.push(resultFilePath)

      if (Debug.enabled('latternfish')) {
        const fstat = await fsPromise.stat(resultFilePath)
        log.info(`[day ${i + 1} ends]: fish size: ${fstat.size}`)
      }
    }

    // Finish up, log, and clean up
    const fstat = await fsPromise.stat(tmpFiles[tmpFiles.length - 1] as string)
    log.info(`tmp file paths:\n${tmpFiles.map(t => `  ${t}\n`).join('')}`)

    if (!this.keepTmpFiles) {
      await Promise.allSettled(tmpFiles.map(f => fsPromise.rm(f)))
    }

    return fstat.size
  }

  static async fishOutStream(inputFileName: string): Promise<[number, string]> {
    return new Promise((resolve, reject) => {
      let readStream =
        fs.createReadStream(inputFileName, { encoding: 'utf8', highWaterMark: CHUNK_SIZE })

      let out = ''

      readStream.on('data', chunk => {
        out = out.concat(chunk as string)
      })

      readStream.on('end', async () => {
        resolve([readStream.bytesRead, out])
      })

      readStream.on('error', err => {
        reject(err)
      })
    })
  }

  static modelForOneDay(inputFileName: string, dayToSpawn: number, initDayToSpawn: number):
    Promise<string>
  {
    return new Promise(async (resolve, reject) => {
      const { temporaryFile } = await import('tempy')
      let tmpFilePath = temporaryFile()

      let readStream =
        fs.createReadStream(inputFileName, { encoding: 'utf8', highWaterMark: CHUNK_SIZE })
      let writeStream =
        fs.createWriteStream(tmpFilePath, { encoding: 'utf8', highWaterMark: CHUNK_SIZE })
      let numSpawn = 0

      readStream.on('data', chunk => {
        let fishes = Uint8Array.from(chunk as Buffer)

        fishes = fishes.map(fish => {
          numSpawn += fish > 0 ? 0 : 1
          return fish > 0 ? fish - 1 : dayToSpawn
        })

        writeStream.write(fishes.join(''))
      })

      readStream.on('end', async () => {
        // Write the spawn fishes in chunk size
        while (numSpawn > 0) {
          let toSpawn = Math.min(numSpawn, CHUNK_SIZE)
          // write the spawned fishes
          writeStream.write(new Uint8Array(toSpawn).fill(initDayToSpawn).join(''))
          numSpawn -= toSpawn
        }

        writeStream.close(err => err
          ? reject(`Error on writing to stream: ${err.toString()}`)
          : resolve(tmpFilePath)
        )
      })

      readStream.on('error', err => reject(`Error on reading stream: ${err.toString()}`))
    })
  }
}

export { Latternfish as default, Latternfish, LatternfishConfig }
