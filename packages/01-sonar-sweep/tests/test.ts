import { strict as assert } from 'node:assert'
import { SonarSweep, CountDeltaType } from '../src/SonarSweep'

function cntObjHelper(obj?: unknown): CountDeltaType {
  if (!obj) return { increasing: 0, noChange: 0, decreasing: 0 }

  return {
    increasing: (obj as CountDeltaType).increasing ?? 0,
    noChange: (obj as CountDeltaType).noChange ?? 0,
    decreasing: (obj as CountDeltaType).decreasing ?? 0
  }
}

describe('SonarSweep test', () => {
  it('test for empty input', () => {
    const ss = new SonarSweep([])
    assert.deepEqual(ss.count(), cntObjHelper(), 'empty array should returns 0.')
  })

  it('test for single input', () => {
    const ss = new SonarSweep([100])
    assert.deepEqual(ss.count(), cntObjHelper(), 'empty array should returns 0.')
  })

  it('test for a single increasing case', () => {
    const ss = new SonarSweep([100, 101])
    assert.deepEqual(ss.count(), cntObjHelper({ increasing: 1 }), 'empty array should returns 0.')
  })

  it('test for a single decreasing case', () => {
    const ss = new SonarSweep([100, 99])
    assert.deepEqual(ss.count(), cntObjHelper({ decreasing: 1 }), 'empty array should returns 0.')
  })

  it('test for a complex case with 1 window width', () => {
    const ss = new SonarSweep([100, 99, 100, 101, 105, 100, 98])
    assert.deepEqual(
      ss.count(),
      cntObjHelper({ increasing: 3, decreasing: 3 }),
      'empty array should returns 0.'
    )
  })

  it('test for a complex case with 3 window width', () => {
    const ss = new SonarSweep([100, 99, 100, 101, 105, 100, 98])
    assert.deepEqual(
      ss.count(3),
      cntObjHelper({ increasing: 2, noChange: 1, decreasing: 1 }),
      'empty array should returns 0.'
    )
  })
})
