import * as express from 'express'
import * as fs from 'fs'
import * as multer from 'multer'

import { StorageBackend } from '../../'
import { getFile } from './get-file'
import { postFile } from './post-file'

export const fileSystem: (rootDir: string) => StorageBackend = rootDir => {
  fs.access(rootDir, (error: any) => {
    if (error) {
      fs.mkdir(rootDir + '/tmp', () => null)
    }
  })
  const upload = multer({ dest: `${rootDir}/tmp` })
  const app: express.Express = express()
  app.get('/*', getFile(rootDir))
  app.post('/:app/:key', upload.single('package'), postFile(rootDir))

  return app
}
