import { Request, Response } from 'express'
import { RequestHandler } from 'express'
import * as httpMocks from 'node-mocks-http'

const mockFS = { mkdir: jest.fn(), rename: jest.fn(), rmdir: jest.fn() }
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
  let send: () => void
  let status: (code: number) => Response
  const rootDir = '/var/www/files'

  beforeEach(() => {
    handler = postFile(rootDir)
    send = jest.fn()
    status = jest.fn(() => ({ send }))
    mockFS.mkdir.mockClear()
    mockFS.rename.mockClear()
    mockFS.rmdir.mockClear()
    mockTar.extract.mockClear()
  })

  it('sends a 201 Created', () => {
    const req = createRequest(rootDir)
    const res = httpMocks.createResponse()
    res.status = status
    handler(req, res, jest.fn())

    expect(status).toHaveBeenCalledWith(201)
  })

  it('sends a message including the deployment link', () => {
    const req = createRequest(rootDir)
    req.protocol = 'https'
    req.get = jest.fn(() => 'backstage.example.com')
    const res = httpMocks.createResponse()
    res.status = status
    handler(req, res, jest.fn())

    const expectedMessage = 'Your deploy can now be viewed at https://backstage.example.com/?app=myApp&key=someKey'
    expect(send).toHaveBeenCalledWith({ message: expectedMessage })
  })

  it('deletes an existing directory for the key', () => {
    const req = createRequest(rootDir)
    const res = httpMocks.createResponse()
    handler(req, res, jest.fn())

    expect(mockFS.rmdir).toHaveBeenCalledWith(`${rootDir}/packages/myApp/someKey`, expect.any(Function))
  })

  it('creates a directory for the key', () => {
    const req = createRequest(rootDir)
    const res = httpMocks.createResponse()
    handler(req, res, jest.fn())

    expect(mockFS.mkdir).toHaveBeenCalledWith(`${rootDir}/packages/myApp/someKey`, expect.any(Function))
  })

  it('extracts the archive to `<rootDir>/packages/<appName>/<keyName>`', () => {
    const req = createRequest(rootDir)
    const res = httpMocks.createResponse()
    handler(req, res, jest.fn())

    const extractionPath = '/var/www/files/packages/myApp/someKey'
    expect(mockTar.extract).toHaveBeenCalledWith({ file: req.file.path, cwd: extractionPath })
  })

  describe('special characters', () => {
    it('normalizes the app name', () => {
      const req = createRequest(rootDir)
      req.params.app = 'myAppName/../@!foo'
      req.file.originalname = 'package.tar.gz'
      const res = httpMocks.createResponse()
      handler(req, res, jest.fn())

      const normalizedAppName = 'myAppName------foo'
      const extractionPath = `/var/www/files/packages/${normalizedAppName}/someKey`
      expect(mockTar.extract).toHaveBeenCalledWith(expect.objectContaining({ cwd: extractionPath }))
    })

    it('normalizes the key name', () => {
      const req = createRequest(rootDir)
      req.params.key = 'myBranchName/../@!foo'
      req.file.originalname = 'package.tar.gz'
      const res = httpMocks.createResponse()
      handler(req, res, jest.fn())

      const normalizedKeyName = 'myBranchName------foo'
      const extractionPath = `/var/www/files/packages/myApp/${normalizedKeyName}`
      expect(mockTar.extract).toHaveBeenCalledWith(expect.objectContaining({ cwd: extractionPath }))
    })
  })
})
