import { Response } from 'express'
import * as httpMocks from 'node-mocks-http'

const mockFS = { existsSync: jest.fn() }
jest.mock('fs', () => mockFS)

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

    mockFS.existsSync.mockClear()
  })

  it('calls `res.sendFile` with the correct directory if the requested file exists', () => {
    mockFS.existsSync = jest.fn(() => true)
    getFile('rootDir')(req, res, jest.fn())

    expect(res.sendFile).toHaveBeenCalledWith(expect.stringMatching(/^rootDir\/packages\/app\/key\/my\/file/))
  })

  it('serves `index.html` if the requested file does not exist', () => {
    mockFS.existsSync = jest.fn(() => false)
    getFile('rootDir')(req, res, jest.fn())

    expect(res.sendFile).toHaveBeenCalledWith(expect.stringMatching(/^rootDir\/packages\/app\/key\/index\.html/))
  })
})
