import { expect } from 'chai'
import { isNotNullOrUndefined, capitalize } from './utils'

describe('@aoc-2021/utils', () => {
  it('test isNotNullOrUndefined()', () => {
    expect(isNotNullOrUndefined(null)).to.be.false
    expect(isNotNullOrUndefined(undefined)).to.be.false
    expect(isNotNullOrUndefined(0)).to.be.true
    expect(isNotNullOrUndefined(false)).to.be.true
    expect(isNotNullOrUndefined('')).to.be.true
  })

  it('test capitalize()', () => {
    expect(capitalize('')).to.equal('')
    expect(capitalize('quick brown fox')).to.equal('Quick Brown Fox')
    expect(capitalize('QUICK')).to.equal('QUICK')
  })
})
