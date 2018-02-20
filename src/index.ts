import * as cookieParser from 'cookie-parser'
import * as express from 'express'

import { setPackage } from './setPackage'

export type StorageBackend = express.RequestHandler

export const backstage = (storageBackend: StorageBackend): express.Express => {
  const app: express.Express = express()
  app.use(cookieParser())
  app.use('/__backstage/go/:app/:key', setPackage)
  app.use(storageBackend)
  return app
}
