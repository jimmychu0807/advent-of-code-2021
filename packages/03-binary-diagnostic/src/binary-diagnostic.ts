'use strict'

class BinaryDiagnostic {
  input: string[]

  constructor(input: string[]) {
    this.input = input
  }

  powerConsumption(): number {
    return this.gamma() * this.epsilon()
  }

  gamma(): number {
    const len = this.input[0]?.length ?? 0
    const result: number[] = []

    for (let i = 0; i < len; i++) {
      result.push(this.getMostDigitAt(this.input, i))
    }

    return this.arrBinaryToDecimal(result)
  }

  epsilon(): number {
    const len = this.input[0]?.length ?? 0
    const result: number[] = []

    for (let i = 0; i < len; i++) {
      result.push(1 - this.getMostDigitAt(this.input, i))
    }

    return this.arrBinaryToDecimal(result)
  }

  private getMostDigitAt(input: string[], ind: number): number {
    const countOne = input.map((str) => str.slice(ind, ind + 1)).filter((val) => val === '1').length

    const countZero = input.length - countOne

    return countOne > countZero ? 1 : 0
  }

  private arrBinaryToDecimal(arr: number[]): number {
    let resInDecimal = 0
    const len = arr.length

    arr.forEach((val, ind) => {
      resInDecimal += val * 2 ** (len - ind - 1)
    })

    return resInDecimal
  }
}

export { BinaryDiagnostic as default, BinaryDiagnostic }
