import * as cookieParser from 'cookie-parser'
import * as express from 'express'

import { getStaticFile } from './getStaticFile'
import { setPackageFromQueryParams } from './setPackageFromQueryParams'

export const getApp = () => {
  const app: express.Express = express()
  app.use(cookieParser())
  app.use(setPackageFromQueryParams)
  app.use(getStaticFile)
  return app
}
