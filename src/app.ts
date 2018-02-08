import * as cookieParser from 'cookie-parser'
import * as express from 'express'

import { setPackageFromQueryParams } from './setPackageFromQueryParams'

export type StorageBackend = express.RequestHandler

export const getApp = (storageBackend: StorageBackend) => {
  const app: express.Express = express()
  app.use(cookieParser())
  app.use(setPackageFromQueryParams)
  app.use(storageBackend)
  return app
}
