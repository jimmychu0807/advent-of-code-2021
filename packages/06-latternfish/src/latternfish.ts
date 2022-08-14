'use struct'
import Debug from 'debug'
import * as fsPromise from 'fs/promises'
import * as fs from 'fs'

const log = {
  info: Debug('latternfish:info')
}

interface LatternfishConfig {
  fishes: Uint8Array | Array<number>
  dayToSpawn: number
  initDayToSpawn: number
  daySimulation: number
}

const CHUNK_SIZE = 50*1024*1024

// opt 1: use Uint8Array
// opt 2: write to two tmp files

class Latternfish {
  static DEBUG = 1

  static async modeling(config: LatternfishConfig): Promise<number> {
    // Using dynamic import here to load es-module in commonjs
    const { temporaryFile } = await import('tempy')

    const { fishes,  dayToSpawn, initDayToSpawn, daySimulation } = config
    let result = Uint8Array.of(...fishes)

    let resultFilePath = temporaryFile()
    await fsPromise.writeFile(resultFilePath, result.join(''))

    for (let i = 0; i < daySimulation; i++) {
      let newResultFilePath = await this.modelForOneDay(resultFilePath, dayToSpawn, initDayToSpawn)
      await fsPromise.rm(resultFilePath)
      resultFilePath = newResultFilePath

      log.info(`[day ${i} ends]`)

      if (this.DEBUG === 1) {
        const fstat = await fsPromise.stat(resultFilePath)
        log.info(`fish size: ${fstat.size}`)
      } else if (this.DEBUG === 2) {
        const [len, out] = await this.fishOutStream(newResultFilePath)
        log.info(`fishes size: ${len},`, out)
      }
    }
    const fstat = await fsPromise.stat(resultFilePath)

    if (this.DEBUG >= 1) {
      log.info(`output file path: ${resultFilePath}`)
      log.info(`number of fish: ${fstat.size}`)
    } else {
      await fsPromise.rm(resultFilePath)
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
         console.log(`Error occur on reading result: ${err}`);
         reject(err);
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

      let writeChunk = ''

      readStream.on('data', chunk => {
        let fishes = (chunk as string).split('').map(c => Number(c))

        fishes.forEach(fish => {
          if (fish > 0) {
            writeStream.write((fish - 1).toString())
          } else {
            writeStream.write(dayToSpawn.toString())
            numSpawn += 1
          }
        })
      })

      readStream.on('end', async () => {
        let spawnChar = initDayToSpawn.toString()

        while (numSpawn > 0) {
          let toSpawn = Math.min(numSpawn, CHUNK_SIZE)
          // write the spawned fishes
          writeStream.write(Array(toSpawn).fill(spawnChar).join(''))
          numSpawn -= toSpawn
        }

        await closeWriteStream(writeStream)
        resolve(tmpFilePath)
      })

      readStream.on('error', function(err) {
       console.log(`Error occur on reading result: ${err}`);
       reject(err);
      });
    })
  }
}

async function closeWriteStream(writeStream: fs.WriteStream) {
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

export { Latternfish as default, Latternfish, LatternfishConfig }
