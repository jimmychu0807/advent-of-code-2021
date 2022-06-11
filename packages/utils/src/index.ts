import * as fs from 'fs'

interface ReadInputOpts {
  type: 'string' | 'number'
}

function readInput(path: string, opts: ReadInputOpts): string[] | number[] {
  const buffer = fs
    .readFileSync(path, { encoding: 'utf-8' })
    .split('\n')
    .map((l) => l.trim())

  if (opts.type === 'string') return buffer

  // Convert all values to number
  return buffer.map((l) => Number(l))
}

export { readInput }
