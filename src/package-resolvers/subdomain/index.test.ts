import * as httpMocks from 'node-mocks-http'
import { subdomain } from './index'

describe('subdomain package resolver', () => {
  describe('getPackageIdentifierFromRequest', () => {
    it('gets the app and key from subdomains', () => {
      const req = httpMocks.createRequest()
      req.hostname = 'somekey.myapp.backstage.example.com'
      const expected = { app: 'myapp', key: 'somekey' }

      expect(subdomain.getPackageIdentifierFromRequest(req)).toEqual(expected)
    })
  })

  describe('getPackageURL', () => {
    it('returns the correct URL', () => {
      const req = httpMocks.createRequest()
      req.protocol = 'https'
      req.get = jest.fn(() => 'backstage.example.com')
      const packageIdentifier = { app: 'myapp', key: 'somekey' }

      expect(subdomain.getPackageURL(req, packageIdentifier))
        .toBe('https://somekey.myapp.backstage.example.com/')
    })
  })
})
