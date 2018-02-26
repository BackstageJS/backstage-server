import { Request, Response } from 'express'
import * as httpMocks from 'node-mocks-http'

import { setPackageFromQueryString } from './setPackageFromQueryString'

describe('setPackageFromQueryString', () => {
  let res: Response

  beforeEach(() => res = httpMocks.createResponse())

  describe('when the `app` and `key` path params are not set', () => {
    it('calls `next()`', () => {
      const req = httpMocks.createRequest({ params: {} })
      const next = jest.fn()
      setPackageFromQueryString(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when only the `app` path param is set', () => {
    it('calls `next()`', () => {
      const req = httpMocks.createRequest({ params: { app: 'foo' } })
      const next = jest.fn()
      setPackageFromQueryString(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when only the `key` path param is set', () => {
    it('calls `next()`', () => {
      const req = httpMocks.createRequest({ params: { key: 'foo' } })
      const next = jest.fn()
      setPackageFromQueryString(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when both the `app` and `key` path params are set', () => {
    let next: () => void
    let req: Request

    beforeEach(() => {
      next = jest.fn()
      req = httpMocks.createRequest({ params: { app: 'appName', key: 'keyName' } })
      res.cookie = jest.fn()
      res.redirect = jest.fn()
    })

    it('does not call `next()`', () => {
      setPackageFromQueryString(req, res, next)
      expect(next).not.toHaveBeenCalled()
    })

    it('sets the `app` cookie', () => {
      setPackageFromQueryString(req, res, next)
      expect(res.cookie).toHaveBeenCalledWith('app', 'appName')
    })

    it('sets the `key` cookie', () => {
      setPackageFromQueryString(req, res, next)
      expect(res.cookie).toHaveBeenCalledWith('key', 'keyName')
    })

    it('redirects the user to the requested pathh', () => {
      req.path = '/my/file'
      setPackageFromQueryString(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith('/my/file')
    })
  })
})
