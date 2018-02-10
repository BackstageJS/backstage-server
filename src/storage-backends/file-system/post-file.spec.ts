import { Request, Response } from 'express'
import { RequestHandler } from 'express'
import * as httpMocks from 'node-mocks-http'

const mockFS = { rename: jest.fn() }
jest.mock('fs', () => mockFS)

const mockTar = { extract: jest.fn() }
jest.mock('tar', () => mockTar)

import { postFile } from './post-file'

const createRequest = (rootDir: string): Request => {
  const app = 'myApp'
  const key = 'someKey'
  const destination = `${rootDir}/tmp`
  const filename = 'a1b2c3'
  const path = destination + '/' + filename
  const originalname = 'myFileName.txt'
  const req = httpMocks.createRequest({ params: { app, key } })
  req.file = {
    buffer: null,
    destination,
    encoding: 'UTF-8',
    fieldname: 'package',
    filename,
    mimetype: 'text/plain',
    originalname,
    path,
    size: 1024,
  }

  return req
}

describe('postFile', () => {
  let handler: RequestHandler
  let end: () => void
  let status: (code: number) => Response
  const rootDir = '/var/www/files'

  beforeEach(() => {
    handler = postFile(rootDir)
    end = jest.fn()
    status = jest.fn(() => ({ end }))
    mockFS.rename.mockClear()
    mockTar.extract.mockClear()
  })

  it('sends a 201 Created', () => {
    const req = createRequest(rootDir)
    const res = httpMocks.createResponse()
    res.status = status
    handler(req, res, jest.fn())

    expect(status).toHaveBeenCalledWith(201)
  })

  describe("when the uploaded file's original name ends in `.tar.gz`", () => {
    it('is extracted to `<rootDir>/<appName>/<keyName>/<filename>`', () => {
      const req = createRequest(rootDir)
      req.file.originalname = 'package.tar.gz'
      const res = httpMocks.createResponse()
      handler(req, res, jest.fn())

      const extractionPath = '/var/www/files/myApp/someKey'
      expect(mockTar.extract).toHaveBeenCalledWith({ file: req.file.path, C: extractionPath })
    })

    it('is not moved', () => {
      const req = createRequest(rootDir)
      req.file.originalname = 'package.tar.gz'
      const res = httpMocks.createResponse()
      handler(req, res, jest.fn())

      expect(mockFS.rename).not.toHaveBeenCalled()
    })
  })

  describe("when the uploaded file's original name doesn't end in `.tar.gz`", () => {
    it('is moved to `<rootDir>/<appName>/<keyName>/<filename>`', () => {
      const req = createRequest(rootDir)
      const res = httpMocks.createResponse()
      res.status = status
      handler(req, res, jest.fn())
      const newPath = '/var/www/files/myApp/someKey/myFileName.txt'

      expect(mockFS.rename).toHaveBeenCalledWith(req.file.path, newPath, expect.any(Function))
    })
  })
})
