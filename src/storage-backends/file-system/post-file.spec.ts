import { Request, Response } from 'express'
import { RequestHandler } from 'express'
import * as httpMocks from 'node-mocks-http'

const mockFS = { writeFile: jest.fn() }
jest.mock('fs', () => mockFS)

import { postFile } from './post-file'

describe('postFile', () => {
  let handler: RequestHandler

  beforeEach(() => {
    handler = postFile('rootDir')
  })

  it('saves the uploaded file into the specified root directory', () => {
    const req = httpMocks.createRequest({ body: { file: 'text' } })
    const res = httpMocks.createResponse()
    const next = jest.fn()
    handler(req, res, next)

    expect(mockFS.writeFile).toHaveBeenCalledWith('rootDir/payload', 'text', expect.any(Function))
  })
})
