import { expect } from 'chai'

import DumboOctopus from './dumbo-octopus.js'

// prettier-ignore
const SMALL_SAMPLE = {
  inputMap: [
    '11111',
    '19991',
    '19191',
    '19991',
    '11111',
  ],
  result: [
    {
      step: 1,
      map: [
        '34543',
        '40004',
        '50005',
        '40004',
        '34543',
      ],
      flashes: 9
    },
    {
      step: 2,
      map: [
        '45654',
        '51115',
        '61116',
        '51115',
        '45654',
      ],
      flashes: 9
    }
  ]
}

const LARGE_SAMPLE = {
  inputMap: [
    '5483143223',
    '2745854711',
    '5264556173',
    '6141336146',
    '6357385478',
    '4167524645',
    '2176841721',
    '6882881134',
    '4846848554',
    '5283751526',
  ],
  result: [
    {
      step: 100,
      map: [
        '0397666866',
        '0749766918',
        '0053976933',
        '0004297822',
        '0004229892',
        '0053222877',
        '0532222966',
        '9322228966',
        '7922286866',
        '6789998766',
      ],
      flashes: 1656
    }
  ]
}

describe('Day 11 - Dumbo Octopus', () => {
  describe('Part I', () => {
    it('dumbo-octopus model small sample', () => {
      let { step, map, flashes } = SMALL_SAMPLE.result[0]!
      expect(DumboOctopus.modeling(SMALL_SAMPLE.inputMap, step)).eql([flashes, map])

      ;({ step, map, flashes } = SMALL_SAMPLE.result[1]!)
      expect(DumboOctopus.modeling(SMALL_SAMPLE.inputMap, step)).eql([flashes, map])
    })

    it('dumbo-octopus model large sample', () => {
      let { step, map, flashes } = LARGE_SAMPLE.result[0]!
      expect(DumboOctopus.modeling(LARGE_SAMPLE.inputMap, step)).eql([flashes, map])
    })
  })

  describe('Part II', () => {
    it('pending test')
  })
})
