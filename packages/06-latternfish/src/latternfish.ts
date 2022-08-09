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

class Latternfish {
  static modeling(config: LatternfishConfig, days: number): number[] {
    const { fishes, dayToSpawn, initDayToSpawn } = config
    let result = [...fishes]

    for (let day = 0; day < days; day++) {
      const tmpResult = []

      while (result.length > 0) {
        const fish = result.shift() as number
        if (fish > 0) {
          tmpResult.push(fish - 1)
        } else {
          tmpResult.push(dayToSpawn, initDayToSpawn)
        }
      }

      result = [...tmpResult]

      log.info(`End of day ${day}`)
      log.debug(`Result`, result)
    }

    return result
  }
}

export { Latternfish as default, Latternfish, LatternfishConfig }
