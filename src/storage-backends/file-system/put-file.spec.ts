import { Request, Response } from 'express'
import { RequestHandler } from 'express'
import * as httpMocks from 'node-mocks-http'

import { putFile } from './put-file'

describe('putFile', () => {
  let handler: RequestHandler

  beforeEach(() => handler = putFile('rootDir'))

  describe("when the path doesn't match `/:app/:key`", () => {
    it('calls next', () => {
      const req = httpMocks.createRequest()
      const res = httpMocks.createResponse()
      const next = jest.fn()
      handler(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })
})
