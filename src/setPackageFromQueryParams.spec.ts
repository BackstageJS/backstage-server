import { Request, Response } from 'express'
import * as httpMocks from 'node-mocks-http'

import { setPackageFromQueryParams } from './setPackageFromQueryParams'

describe('setPackageFromQueryParams', () => {
  let res: Response

  beforeEach(() => res = httpMocks.createResponse())

  describe('when the `app` and `key` query params are not set', () => {
    it('calls `next()`', () => {
      const req = httpMocks.createRequest({ query: {} })
      const next = jest.fn()
      setPackageFromQueryParams(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when only the `app` query param is set', () => {
    it('calls `next()`', () => {
      const req = httpMocks.createRequest({ query: { app: 'foo' } })
      const next = jest.fn()
      setPackageFromQueryParams(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when only the `key` query param is set', () => {
    it('calls `next()`', () => {
      const req = httpMocks.createRequest({ query: { key: 'foo' } })
      const next = jest.fn()
      setPackageFromQueryParams(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when both the `app` and `key` query params are set', () => {
    let next: () => void
    let req: Request

    beforeEach(() => {
      next = jest.fn()
      req = httpMocks.createRequest({ query: { app: 'appName', key: 'keyName' } })
      res.cookie = jest.fn()
      res.redirect = jest.fn()
    })

    it('does not call `next()`', () => {
      setPackageFromQueryParams(req, res, next)
      expect(next).not.toHaveBeenCalled()
    })

    it('sets the `app` cookie', () => {
      setPackageFromQueryParams(req, res, next)
      expect(res.cookie).toHaveBeenCalledWith('app', 'appName')
    })

    it('sets the `key` cookie', () => {
      setPackageFromQueryParams(req, res, next)
      expect(res.cookie).toHaveBeenCalledWith('key', 'keyName')
    })

    it('redirects the user to the requested pathh', () => {
      req.path = '/my/file'
      setPackageFromQueryParams(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith('/my/file')
    })
  })
})
