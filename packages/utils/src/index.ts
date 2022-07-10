import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

interface ReadInputOpts {
  type: 'string' | 'number'
}

function readInput(path: string, opts: ReadInputOpts): string[] | number[] {
  const reducedResult = fs
    .readFileSync(path, { encoding: 'utf-8' })
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

function currentPathName(curr: string): [string, string] {
  const __filename = fileURLToPath(curr)
  const __dirname = path.dirname(__filename)
  return [__filename, __dirname]
}

export { readInput, isNotNullOrUndefined, currentPathName }
