import { Command } from 'commander'
import { Latternfish } from './latternfish'

const input =
  '1,3,4,1,1,1,1,1,1,1,1,2,2,1,4,2,4,1,1,1,1,1,5,4,1,1,2,1,1,1,1,4,1,1,1,4,4,1,1,1,1,1,1,1,2,4,1,3,1,1,2,1,2,1,1,4,1,1,1,4,3,1,3,1,5,1,1,3,4,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,5,2,5,5,3,2,1,5,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,5,1,1,1,1,5,1,1,1,1,1,4,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,3,1,2,4,1,5,5,1,1,5,3,4,4,4,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,5,3,1,4,1,1,2,2,1,2,2,5,1,1,1,2,1,1,1,1,3,4,5,1,2,1,1,1,1,1,5,2,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5,1,4,1,5,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,5,4,5,1,1,1,1,1,1,1,5,1,1,3,1,1,1,3,1,4,2,1,5,1,3,5,5,2,1,3,1,1,1,1,1,3,1,3,1,1,2,4,3,1,4,2,2,1,1,1,1,1,1,1,5,2,1,1,1,2'

const command = new Command('latternfish')
  .description('Day 06 - Latternfish')
  .showHelpAfterError()
  .action(async () => {
    const fishes = Uint8Array.from(input.split(',').map((v) => Number(v)))

    const result1 = await Latternfish.modeling(
      {
        fishes,
        dayToSpawn: 6,
        initDayToSpawn: 8,
        daySimulation: 80
      },
    )

    console.log('Part I result is:', result1)

    const result2 = Latternfish.modeling(
      {
        fishes,
        dayToSpawn: 6,
        initDayToSpawn: 8,
        daySimulation: 200
      },
    )
    console.log('Part II result is:', result2)
  })

export { command as default }
