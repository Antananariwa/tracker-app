import { describe, it, expect } from 'vitest'
import { pickDateLabel, pickTicks, thinData } from './chartFormat'

const makeDays = (start: string, count: number) => {
  const days: { date: string }[] = []
  const current = new Date(start)
  for (let i = 0; i < count; i++) {
    days.push({ date: current.toISOString().slice(0, 10) })
    current.setUTCDate(current.getUTCDate() + 1)
  }
  return days
}

describe('pickDateLabel', () => {
  it('shows only the year on long ranges', () => {
    expect(pickDateLabel('20Y')('2024-03-15')).toBe('2024')
  })

  it('shows month and short year on mid ranges', () => {
    expect(pickDateLabel('1Y')('2024-03-15')).toBe('Mar 24')
  })
})

describe('pickTicks', () => {
  it('gives one tick per year on a long range', () => {
    const data = makeDays('2021-01-01', 365 * 3)
    expect(pickTicks(data, '20Y')).toEqual(['2021-01-01', '2022-01-01', '2023-01-01'])
  })

  it('drops a partial first year', () => {
    const data = makeDays('2021-11-20', 365 * 2)
    expect(pickTicks(data, '20Y')).toEqual(['2022-01-01', '2023-01-01'])
  })

  it('returns undefined on short ranges', () => {
    const data = makeDays('2024-01-01', 21)
    expect(pickTicks(data, '1M')).toBeUndefined()
  })
})

describe('thinData', () => {
  it('leaves short data alone', () => {
    const data = makeDays('2024-01-01', 10)
    expect(thinData(data, 400)).toBe(data)
  })

  it('reduces long data and keeps the last point', () => {
    const data = makeDays('2020-01-01', 1000)
    const thinned = thinData(data, 100)
    expect(thinned.length).toBeLessThanOrEqual(101)
    expect(thinned[thinned.length - 1]).toEqual(data[data.length - 1])
  })
})