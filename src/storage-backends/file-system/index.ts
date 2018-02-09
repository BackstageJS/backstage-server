import * as express from 'express'

import { StorageBackend } from '../../app'
import { getFile } from './get-file'
import { postFile } from './post-file'

export const fileSystem: (rootDir: string) => StorageBackend = rootDir => {
  const router: express.Router = express.Router()
  router.get('/*', getFile(rootDir))
  router.post('/:app/:key', postFile(rootDir))

  return router
}
