import * as express from 'express'
import * as fs from 'fs'
import * as multer from 'multer'

import { StorageBackend } from '../storage-backend'
import { getFile } from './get-file'
import { postFile } from './post-file'

export type FileSystem = (rootDir: string) => StorageBackend

export const fileSystem: FileSystem = rootDir => {
  fs.access(rootDir, (error: any) => {
    if (error) {
      fs.mkdir(rootDir + '/tmp', () => null)
    }
  })
  const upload = multer({ dest: `${rootDir}/tmp` })
  const app: express.Express = express()
  app.get('/*', getFile(rootDir))
  app.post('/__backstage/deploy/:app/:key', upload.single('package'), postFile(rootDir))

  return app
}
