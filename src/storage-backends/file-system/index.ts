import { RequestHandler } from 'express'

import { StorageBackend } from '../../app'
import { getFile } from './get-file'

export const fileSystem: (rootDir: string) => StorageBackend = rootDir => (req, res, next) => {
  if (req.method === 'GET') {
    return getFile(rootDir)(req, res, next)
  }
}
