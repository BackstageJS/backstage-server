import { Request, Response } from 'express'
import { RequestHandler } from 'express'
import * as httpMocks from 'node-mocks-http'

import { postFile } from './post-file'

describe('postFile', () => {
  let handler: RequestHandler
  let end: () => void
  let status: (code: number) => Response

  beforeEach(() => {
    handler = postFile('rootDir')
    end = jest.fn()
    status = jest.fn(() => ({ end }))
  })

  it('sends a 201 Created', () => {
    const req = httpMocks.createRequest()
    const res = httpMocks.createResponse()
    res.status = status
    handler(req, res, jest.fn())

    expect(status).toHaveBeenCalledWith(201)
  })
})
