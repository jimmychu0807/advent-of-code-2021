'use strict'

type ZeroOrOneChar = '0' | '1'

class BinaryDiagnostic {
  input: string[]

  constructor(input: string[]) {
    this.input = input
  }

  get powerConsumption(): number {
    return this.gamma * this.epsilon
  }

  get gamma(): number {
    return this.concatDigitBy(this.getMostFreqDigitAt.bind(this))
  }

  get epsilon(): number {
    return this.concatDigitBy(this.getLeastFreqDigitAt.bind(this))
  }

  private concatDigitBy(func: (input: string[], i: number) => ZeroOrOneChar): number {
    const len = this.input[0]?.length ?? 0
    let result = ''

    for (let i = 0; i < len; i++) {
      result = result.concat(func(this.input, i))
    }

    return this.binaryToDecimal(result)
  }

  get lifeSupportRating(): number {
    return this.oxygenRating * this.co2Rating
  }

  get oxygenRating(): number {
    return this.filterInputByDigitFunc(this.getMostFreqDigitAt.bind(this))
  }

  get co2Rating(): number {
    return this.filterInputByDigitFunc(this.getLeastFreqDigitAt.bind(this))
  }

  private filterInputByDigitFunc(func: (input: string[], i: number) => ZeroOrOneChar): number {
    let input = [...this.input]

    const len = this.input[0]?.length ?? 0

    for (let i = 0; i < len; i++) {
      if (input.length <= 1) break

      const digit = func(input, i)
      input = input.filter((str) => digit === str.slice(i, i + 1))
    }

    if (input.length > 1) {
      throw new Error('Multiple value exists in oxygen rating.')
    } else if (input.length === 0) {
      throw new Error('No value exists in oxygen rating.')
    }

    return this.binaryToDecimal(input[0] as string)
  }

  private getMostFreqDigitAt(input: string[], ind: number): ZeroOrOneChar {
    const countOne = input.map((str) => str.slice(ind, ind + 1)).filter((val) => val === '1').length
    const countZero = input.length - countOne
    return countOne >= countZero ? '1' : '0'
  }

  private getLeastFreqDigitAt(input: string[], ind: number): ZeroOrOneChar {
    return this.getMostFreqDigitAt(input, ind) === '1' ? '0' : '1'
  }

  private binaryToDecimal(input: string): number {
    return input
      .split('')
      .reduce((mem, curr, ind) => mem + Number(curr) * 2 ** (input.length - ind - 1), 0)
  }
}

export { BinaryDiagnostic as default, BinaryDiagnostic }
