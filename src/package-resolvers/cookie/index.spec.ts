import * as httpMocks from 'node-mocks-http'
import { cookie, redirectToPackageMiddleware } from './index'

describe('cookie package resolver', () => {
  describe('getPackageIdentifierFromRequest', () => {
    it('returns the app and key from cookies', () => {
      const req = httpMocks.createRequest({ cookies: { __backstageApp: 'myApp', __backstageKey: 'someKey' } })
      const expected = { app: 'myApp', key: 'someKey' }
      const actual = cookie.getPackageIdentifierFromRequest(req)

      expect(actual).toEqual(expected)
    })

    it('throws if the app cookie is not set', () => {
      const req = httpMocks.createRequest({ cookies: { __backstageKey: 'someKey' } })
      expect(() => cookie.getPackageIdentifierFromRequest(req)).toThrowError('The __backstageApp cookie is required')
    })

    it('throws if the key cookie is not set', () => {
      const req = httpMocks.createRequest({ cookies: { __backstageApp: 'myApp' } })
      expect(() => cookie.getPackageIdentifierFromRequest(req)).toThrowError('The __backstageKey cookie is required')
    })
  })

  describe('getPackageURL', () => {
    it('returns the correct URL', () => {
      const req = httpMocks.createRequest()
      req.protocol = 'https'
      req.get = jest.fn(() => 'backstage.example.com')
      const packageIdentifier = { app: 'myApp', key: 'someKey' }

      expect(cookie.getPackageURL(req, packageIdentifier))
        .toBe('https://backstage.example.com/__backstage/go/myApp/someKey')
    })
  })

  describe('redirectToPackage', () => {
    const req = httpMocks.createRequest()
    const res = httpMocks.createResponse()
    let next: jest.Mock

    beforeEach(() => {
      req.params = { app: 'myApp', key: 'someKey' }
      res.cookie = jest.fn()
      next = jest.fn()
    })

    it('sets the app cookie', () => {
      redirectToPackageMiddleware(req, res, next)
      expect(res.cookie).toHaveBeenCalledWith('__backstageApp', 'myApp')
    })

    it('sets the key cookie', () => {
      redirectToPackageMiddleware(req, res, next)
      expect(res.cookie).toHaveBeenCalledWith('__backstageKey', 'someKey')
    })

    it('redirects to /', () => {
      res.redirect = jest.fn()
      redirectToPackageMiddleware(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('/')
    })
  })
})
