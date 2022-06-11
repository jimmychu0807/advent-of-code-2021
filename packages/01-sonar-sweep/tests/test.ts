import * as assert from "assert"
import SonarSweep from '../src/SonarSweep';

describe('SonarSweep test', () => {
  it('should returns 0 for empty input', () => {
    const ss = new SonarSweep([])
    assert.equal(ss.countIncreasing(), 0, "empty array should returns 0.")
  })

  it('should returns 0 for single input', () => {
    const ss = new SonarSweep([100])
    assert.equal(ss.countIncreasing(), 0, "empty array should returns 0.")
  })

  it('should return 1 in simple case', () => {
    const ss = new SonarSweep([100, 101])
    assert.equal(ss.countIncreasing(), 1, "empty array should returns 0.")
  })

  it('should return 0 in simple case', () => {
    const ss = new SonarSweep([100, 99])
    assert.equal(ss.countIncreasing(), 0, "empty array should returns 0.")
  })

  it('should return 3 in a more complex case', () => {
    const ss = new SonarSweep([100, 99, 100, 101, 105, 100, 98])
    assert.equal(ss.countIncreasing(), 3, "empty array should returns 0.")
  })
})
