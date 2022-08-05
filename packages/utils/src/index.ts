import * as fs from 'fs'
import * as path from 'path'

interface ReadInputOpts {
  type: 'string' | 'number'
}

function readInput(inputPath: string, opts: ReadInputOpts): string[] | number[] {
  const absPath = path.isAbsolute(inputPath) ? inputPath : path.join(process.cwd(), inputPath)

  const reducedResult = fs
    .readFileSync(absPath, { encoding: 'utf-8' })
    .split('\n')
    .map((l) => l.trim())
    .reduce<[string[], string[], boolean]>(
      (mem, l) => {
        const [accum, buf, bStarted] = mem
        return l.length > 0
          ? [bStarted ? accum.concat(...buf, l) : [l], [], true]
          : [accum, buf.concat(l), bStarted]
      },
      [[], [], false]
    ) // Discard beginning and trailing empty lines

  if (opts.type === 'string') return reducedResult[0]

  // Convert all values to number
  return reducedResult[0].map((l) => Number(l))
}

// Type guard
function isNotNullOrUndefined<T>(input: T | null | undefined): input is T {
  return input != null
}

function capitalize(input: string): string {
  const arr = input.split(' ')
  return arr.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export { readInput, isNotNullOrUndefined, capitalize }
