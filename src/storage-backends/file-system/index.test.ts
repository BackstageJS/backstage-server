import * as httpMocks from 'node-mocks-http'

let mockGetHandler: () => void
let mockPutHandler: () => void

const mockGetFile = jest.fn(() => mockGetHandler)
const mockPutFile = jest.fn(() => mockPutHandler)

jest.mock('./get-file.ts', () => ({ getFile: mockGetFile }))
jest.mock('./put-file.ts', () => ({ putFile: mockPutFile }))

import { fileSystem } from './index'

describe('fileSystem', () => {
  beforeEach(() => {
    mockGetHandler = jest.fn()
    mockPutHandler = jest.fn()
  })

  it('calls `getFile()` for a GET request', () => {
    const req = httpMocks.createRequest({ method: 'GET', path: '/filename.txt' })
    const res = httpMocks.createResponse()
    const next = jest.fn()
    fileSystem('rootDir')(req, res, next)

    expect(mockGetHandler).toHaveBeenCalledWith(req, res, expect.any(Function))
  })

  describe('PUT requests', () => {
    describe("when the path doesn't match /:app/:key", () => {
      it('calls `next()`', () => {
        const req = httpMocks.createRequest({ method: 'GET' })
        const res = httpMocks.createResponse()
        const next = jest.fn()
        fileSystem('rootDir')(req, res, next)

        expect(next).toHaveBeenCalled()
      })

      it('does not call `putFile()`', () => {
        const req = httpMocks.createRequest({ method: 'GET' })
        const res = httpMocks.createResponse()
        const next = jest.fn()
        fileSystem('rootDir')(req, res, next)

        expect(mockPutHandler).not.toHaveBeenCalled()
      })
    })
  })
})
