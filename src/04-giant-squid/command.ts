import { Command } from 'commander'
import GiantSquid from './giant-squid.js'

const command = new Command('giant-squid')
  .description('Day 04 - Giant Squid')
  .requiredOption('-i, --input <inputPath>', 'path to input data')
  .showHelpAfterError()
  .action((options) => {
    const gs = new GiantSquid(options.input)
    const result1 = gs.findWinningBoardAndCondition()
    console.log('Part I result is:', result1)

    const result2 = gs.findLastWinningBoardAndCondition()
    console.log('Part II result is:', result2)
  })

export { command as default }
