import { sanitizeName } from './helpers'

describe('sanitizeName', () => {
  it('normalizes a string', () => {
    expect(sanitizeName('myAppName/../@!foo')).toBe('myappname------foo')
  })
})
