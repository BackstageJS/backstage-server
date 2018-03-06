import * as httpMocks from 'node-mocks-http'
import { cookie, redirectToPackageMiddleware } from './cookie'

describe('cookie package resolver', () => {
  describe('getPackageIdentifierFromRequest', () => {
    it('returns the app and key from cookies', () => {
      const req = httpMocks.createRequest({ cookies: { app: 'myApp', key: 'someKey' } })
      const expected = { app: 'myApp', key: 'someKey' }
      const actual = cookie.getPackageIdentifierFromRequest(req)

      expect(actual).toEqual(expected)
    })

    it('throws if the app cookie is not set', () => {
      const req = httpMocks.createRequest({ cookies: { key: 'someKey' } })
      expect(() => cookie.getPackageIdentifierFromRequest(req)).toThrowError('The app cookie is required')
    })

    it('throws if the key cookie is not set', () => {
      const req = httpMocks.createRequest({ cookies: { app: 'myApp' } })
      expect(() => cookie.getPackageIdentifierFromRequest(req)).toThrowError('The key cookie is required')
    })
  })

  describe('redirectToPackage', () => {
    const req: any = httpMocks.createRequest()
    const res = httpMocks.createResponse()
    let next: jest.Mock

    beforeEach(() => {
      req.packageIdentifier = { app: 'myApp', key: 'someKey' }
      res.cookie = jest.fn()
      next = jest.fn()
    })

    it('sets the app cookie', () => {
      redirectToPackageMiddleware(req, res, next)
      expect(res.cookie).toHaveBeenCalledWith('app', 'myApp')
    })

    it('sets the key cookie', () => {
      redirectToPackageMiddleware(req, res, next)
      expect(res.cookie).toHaveBeenCalledWith('key', 'someKey')
    })

    it('redirects to /', () => {
      res.redirect = jest.fn()
      redirectToPackageMiddleware(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('/')
    })
  })
})
