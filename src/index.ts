import * as cookieParser from 'cookie-parser'
import * as express from 'express'

import { setPackage } from './setPackage'

export type StorageBackend = express.RequestHandler

export interface ServerConfig {
  storageBackend: StorageBackend
}

export const backstage = ({ storageBackend }: ServerConfig): express.Express => {
  const app: express.Express = express()
  app.use(cookieParser())
  app.use('/__backstage/go/:app/:key', setPackage)
  app.use(storageBackend)
  return app
}
