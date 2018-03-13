import * as httpMocks from 'node-mocks-http'
import { subdomain } from './index'

describe('subdomain package resolver', () => {
  describe('getPackageIdentifierFromRequest', () => {
    it('gets the app and key from subdomains', () => {
      const req = httpMocks.createRequest()
      req.hostname = 'someKey.myApp.backstage.example.com'
      const expected = { app: 'myApp', key: 'someKey' }

      expect(subdomain.getPackageIdentifierFromRequest(req)).toEqual(expected)
    })
  })

  describe('getPackageURL', () => {
    it('returns the correct URL', () => {
      const req = httpMocks.createRequest()
      req.protocol = 'https'
      req.get = jest.fn(() => 'backstage.example.com')
      const packageIdentifier = { app: 'myApp', key: 'someKey' }

      expect(subdomain.getPackageURL(req, packageIdentifier))
        .toBe('https://someKey.myApp.backstage.example.com/')
    })
  })
})
