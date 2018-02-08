import { Request, Response } from 'express'
import * as httpMocks from 'node-mocks-http'

import { fileSystem } from './file-system'

describe('fileSystem', () => {
  describe('when the app/key cookies are not set', () => {
    it('calls `next()`', () => {
      const next = jest.fn()
      const req = httpMocks.createRequest({ cookies: {} })
      const res = httpMocks.createResponse()
      fileSystem('rootDir')(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when only the app cookie is set', () => {
    it('calls `next()`', () => {
      const next = jest.fn()
      const req = httpMocks.createRequest({ cookies: { app: 'foo' } })
      const res = httpMocks.createResponse()
      fileSystem('rootDir')(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when only the key cookie is set', () => {
    it('calls `next()`', () => {
      const next = jest.fn()
      const req = httpMocks.createRequest({ cookies: { key: 'foo' } })
      const res = httpMocks.createResponse()
      fileSystem('rootDir')(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when the app/key cookies are both set', () => {
    let req: Request
    let res: Response

    beforeEach(() => {
      req = httpMocks.createRequest({
        cookies: { app: 'app', key: 'key' },
        path: '/my/file',
      })

      res = httpMocks.createResponse()
      res.sendFile = jest.fn()
    })

    it('does not call `next()`', () => {
      const next = jest.fn()
      fileSystem('rootDir')(req, res, next)

      expect(next).not.toHaveBeenCalled()
    })

    it('calls `res.sendFile`', () => {
      fileSystem('rootDir')(req, res, jest.fn())
      expect(res.sendFile).toHaveBeenCalled()
    })

    describe('the `res.sendFile` call', () => {
      it('is relative to the passed-in root directory', () => {
        fileSystem('rootDir')(req, res, jest.fn())
        expect(res.sendFile).toHaveBeenCalledWith(expect.stringMatching(/(.*\/)?rootDir\//))
      })

      it('includes the path requested', () => {
        fileSystem('rootDir')(req, res, jest.fn())
        expect(res.sendFile).toHaveBeenCalledWith(expect.stringContaining(req.path))
      })

      it('includes the app and key requested', () => {
        fileSystem('rootDir')(req, res, jest.fn())
        expect(res.sendFile).toHaveBeenCalledWith(expect.stringContaining('app/key'))
      })
    })
  })
})
