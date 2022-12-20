interface Analysis {
  result: 'complete' | 'incomplete' | 'corrupted'
  char: string
}

const scoring: { [key: string]: number } = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
}

const opens = ['(', '[', '{', '<']
const closes = [')', ']', '}', '>']

class SyntaxScoring {
  static analyseOneLine(input: string): Analysis {
    const stack: string[] = []
    const inputArr = input.split('')

    for (let idx = 0; idx < inputArr.length; idx++) {
      if (opens.indexOf(inputArr[idx]!) >= 0) {
        stack.push(inputArr[idx]!)
      } else if (closes.indexOf(inputArr[idx]!) !== opens.indexOf(stack[stack.length - 1]!)) {
        return { result: 'corrupted', char: inputArr[idx]! }
      } else {
        stack.pop()
      }
    }

    return stack.length > 0 ? { result: 'incomplete', char: '' } : { result: 'complete', char: '' }
  }

  static totalSyntaxErrorScore(input: string[]): number {
    const analyses: Analysis[] = input.map((ln) => this.analyseOneLine(ln))

    return analyses
      .filter((a) => a.result === 'corrupted')
      .map((a) => scoring[a.char]!)
      .reduce((memo: number, score: number) => memo + score, 0)
  }
}

export { SyntaxScoring as default, Analysis }
