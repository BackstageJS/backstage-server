import * as httpMocks from 'node-mocks-http'

let mockGetHandler: () => void
let mockPostHandler: () => void

const mockGetFile = { getFile: () => mockGetHandler }
const mockPostFile = { postFile: () => mockPostHandler }
jest.mock('./get-file.ts', () => mockGetFile)
jest.mock('./post-file.ts', () => mockPostFile)

const mockAccess = (path: string, callback: (error?: any) => void) => callback('error')
const mockMkdir = jest.fn()
const mockFS = { access: mockAccess, mkdir: mockMkdir, mkdirSync: () => null }
jest.mock('fs', () => mockFS)

import { fileSystem } from './index'

describe('fileSystem', () => {
  beforeEach(() => {
    mockGetHandler = jest.fn()
    mockPostHandler = jest.fn()
  })

  it("creates a `<rootDir>/tmp` directory if it doesn't exist yet", () => {
    fileSystem('rootDir')
    expect(mockMkdir).toHaveBeenCalledWith('rootDir/tmp', expect.any(Function))
  })

  describe('requests', () => {
    it('calls `getFile()` for a GET request', () => {
      const req = httpMocks.createRequest({ method: 'GET', path: '/filename.txt' })
      const res = httpMocks.createResponse()
      const next = jest.fn()
      fileSystem('rootDir')(req, res, next)

      expect(mockGetHandler).toHaveBeenCalledWith(req, res, expect.any(Function))
    })

    describe('deploy requests', () => {
      describe('when the path matches /__backstage/deploy/:app/:key', () => {
        it('calls `postFile()`', () => {
          const req = httpMocks.createRequest({ method: 'POST', path: '/__backstage/deploy/myApp/myKey' })
          const res = httpMocks.createResponse()
          const next = jest.fn()
          fileSystem('rootDir')(req, res, next)

          expect(mockPostHandler).toHaveBeenCalled()
        })
      })

      describe("when the path doesn't match /__backstage/deploy/:app/:key", () => {
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
})
