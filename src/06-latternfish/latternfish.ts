import Debug from 'debug'

const log = {
  info: Debug('latternfish')
}

interface Config {
  fishes: Array<number>
  dayToSpawn: number
  initDayToSpawn: number
  daySimulation: number
}

const summation = (arr: Array<number>) => arr.reduce((sum, v) => sum + v, 0)

class Latternfish {
  static modeling(config: Config): number {
    const { fishes, dayToSpawn, initDayToSpawn, daySimulation } = config
    const size = Math.max(dayToSpawn, initDayToSpawn) + 1
    const insertion = Math.min(dayToSpawn, initDayToSpawn)

    let result: Array<number> = fishes.reduce((memo, fish) => {
      memo[fish] += 1
      return memo
    }, new Array(size).fill(0))

    for (let i = 0; i < daySimulation; i++) {
      const newSpawn = result[0] as number
      result = result.slice(1, size)

      // Add back the fish to give birth again
      result[insertion] += newSpawn
      // Newly spawned fish
      result.push(newSpawn)

      log.info(`End of day ${i + 1}: [${result}], summation: ${summation(result)}`)
    }

    return summation(result)
  }
}

export { Latternfish as default, Latternfish, Config }
