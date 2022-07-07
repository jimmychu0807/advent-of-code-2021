'use strict'

type Coordinate = [number, number]

interface Options {
  op: 'noop' | 'multiplication'
}

class Dive {
  input: string[]

  constructor(input: string[]) {
    this.input = input
  }

  execute(opts: Options = { op: 'noop' }): Coordinate | number {
    let xPos = 0
    let yPos = 0

    this.input.forEach((line) => {
      // Ignore the empty lines
      if (line.match(/^\s*$/)) return

      const [ins, step] = line.split(' ')
      const nStep = Number(step)

      switch (ins) {
        case 'forward':
          xPos += nStep
          break
        case 'up':
          yPos -= nStep
          break
        case 'down':
          yPos += nStep
          break
        default:
          throw new Error(`Unknown instruction ${ins}`)
      }
    })

    switch (opts.op) {
      case 'noop':
        return [xPos, yPos]
      case 'multiplication':
        return xPos * yPos
      default:
        throw new Error(`Unknown opts.op ${opts.op}`)
    }
  }
}

export { Dive as default, Dive }
