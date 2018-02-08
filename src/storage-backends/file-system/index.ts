import * as express from 'express'

import { StorageBackend } from '../../app'
import { getFile } from './get-file'
import { putFile } from './put-file'

export const fileSystem: (rootDir: string) => StorageBackend = rootDir => {
  const router: express.Router = express.Router()
  router.get('/*', getFile(rootDir))
  router.put('/:app/:key', putFile(rootDir))

  return router
}
