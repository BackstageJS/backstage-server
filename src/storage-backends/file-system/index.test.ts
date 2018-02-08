import * as httpMocks from 'node-mocks-http'

const mockGetFile = jest.fn(() => () => null)
const mockPutFile = jest.fn(() => () => null)

jest.mock('./get-file.ts', () => ({ getFile: mockGetFile }))
jest.mock('./put-file.ts', () => ({ putFile: mockPutFile }))

import { fileSystem } from './index'

describe('fileSystem', () => {
  beforeEach(() => {
    mockGetFile.mockClear()
    mockPutFile.mockClear()
  })

  it('calls `getFile()` for a GET request', () => {
    const req = httpMocks.createRequest({ method: 'GET' })
    const res = httpMocks.createResponse()
    const next = jest.fn()
    fileSystem('rootDir')(req, res, next)

    expect(mockGetFile).toHaveBeenCalled()
  })
})
