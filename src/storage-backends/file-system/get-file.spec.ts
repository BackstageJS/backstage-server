import { Request, Response } from 'express'
import * as httpMocks from 'node-mocks-http'

import { getFile } from './get-file'

describe('getFile', () => {
  let req: any
  let res: Response

  beforeEach(() => {
    req = {
      ...httpMocks.createRequest({ path: '/my/file' }),
      packageIdentifier: { app: 'app', key: 'key' },
    }

    res = httpMocks.createResponse()
    res.sendFile = jest.fn()
  })

  it('calls `res.sendFile` with the correct directory', () => {
    getFile('rootDir')(req, res, jest.fn())
    expect(res.sendFile).toHaveBeenCalledWith(expect.stringMatching(/^rootDir\/packages\/app\/key\/my\/file/))
  })
})
