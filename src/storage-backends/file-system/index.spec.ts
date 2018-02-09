import * as httpMocks from 'node-mocks-http'

let mockGetHandler: () => void
let mockPostHandler: () => void

const mockGetFile = jest.fn(() => mockGetHandler)
const mockPostFile = jest.fn(() => mockPostHandler)

jest.mock('./get-file.ts', () => ({ getFile: mockGetFile }))
jest.mock('./post-file.ts', () => ({ postFile: mockPostFile }))

import { fileSystem } from './index'

describe('fileSystem', () => {
  beforeEach(() => {
    mockGetHandler = jest.fn()
    mockPostHandler = jest.fn()
  })

  it('calls `getFile()` for a GET request', () => {
    const req = httpMocks.createRequest({ method: 'GET', path: '/filename.txt' })
    const res = httpMocks.createResponse()
    const next = jest.fn()
    fileSystem('rootDir')(req, res, next)

    expect(mockGetHandler).toHaveBeenCalledWith(req, res, expect.any(Function))
  })

  describe('POST requests', () => {
    describe('when the path matches /:app/:key', () => {
      it('calls `postFile()`', () => {
        const req = httpMocks.createRequest({ method: 'POST', path: '/myApp/myKey' })
        const res = httpMocks.createResponse()
        const next = jest.fn()
        fileSystem('rootDir')(req, res, next)

        expect(mockPostHandler).toHaveBeenCalled()
      })
    })

    describe("when the path doesn't match /:app/:key", () => {
      it('does not call `postFile()`', () => {
        const req = httpMocks.createRequest({ method: 'POST', path: '/foo' })
        const res = httpMocks.createResponse()
        const next = jest.fn()
        fileSystem('rootDir')(req, res, next)

        expect(mockPostHandler).not.toHaveBeenCalled()
      })
    })
  })
})
