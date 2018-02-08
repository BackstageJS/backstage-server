import { RequestHandler } from 'express'

import { StorageBackend } from '../../app'
import { fileSystem as getFile } from './file-system'

export const fileSystem: (rootDir: string) => StorageBackend = rootDir => (req, res, next) => {
  if (req.method === 'GET') {
    return getFile(rootDir)(req, res, next)
  }
}
