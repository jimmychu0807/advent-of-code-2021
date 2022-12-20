interface Analysis {
  result: 'complete' | 'incomplete' | 'corrupted'
  char: string
  score: number
}

const score: { [key: string]: { corrupted: number; incomplete: number } } = {
  ')': { corrupted: 3, incomplete: 1 },
  ']': { corrupted: 57, incomplete: 2 },
  '}': { corrupted: 1197, incomplete: 3 },
  '>': { corrupted: 25137, incomplete: 4 }
}

const opens = ['(', '[', '{', '<']
const closes = [')', ']', '}', '>']

// incomplete multiply factor
const incompleteMF = 5

const calcIncompleteScore = (chars: string): number =>
  chars.split('').reduce((memo, c) => memo * incompleteMF + score[c]!.incomplete, 0)

class SyntaxScoring {
  static analyseOneLine(input: string): Analysis {
    const stack: string[] = []
    const inputArr = input.split('')

    for (let idx = 0; idx < inputArr.length; idx++) {
      if (opens.indexOf(inputArr[idx]!) >= 0) {
        stack.push(inputArr[idx]!)
      } else if (closes.indexOf(inputArr[idx]!) !== opens.indexOf(stack[stack.length - 1]!)) {
        const char = inputArr[idx]!
        return { result: 'corrupted', char, score: score[char]!.corrupted }
      } else {
        stack.pop()
      }
    }

    if (stack.length === 0) return { result: 'complete', char: '', score: 0 }

    const char = stack
      .reverse()
      .map((c) => closes[opens.indexOf(c)])
      .join('')
    return { result: 'incomplete', char, score: calcIncompleteScore(char) }
  }

  static totalSyntaxErrorScore(input: string[]): number {
    const analyses: Analysis[] = input.map((ln) => this.analyseOneLine(ln))

    return analyses
      .filter((a) => a.result === 'corrupted')
      .map((a) => a.score)
      .reduce((memo: number, score: number) => memo + score, 0)
  }

  static middleIncompleteScore(input: string[]): number {
    const analyses: Analysis[] = input.map((ln) => this.analyseOneLine(ln))

    const scores: number[] = analyses
      .filter((a) => a.result === 'incomplete')
      .map((a) => a.score)
      .sort((a: number, b: number) => a - b)

    return scores[(scores.length - 1) / 2]!
  }
}

export { SyntaxScoring as default, Analysis }
