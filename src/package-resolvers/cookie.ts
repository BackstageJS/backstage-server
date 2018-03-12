import * as cookieParser from 'cookie-parser'
import * as express from 'express'

import {
  PackageIdentifier,
  PackageResolver,
  RequestHandlerWithPackageIdentifier,
} from './package-resolver'

const getPackageIdentifierFromRequest = (req: express.Request): PackageIdentifier => {
  const { __backstageApp, __backstageKey } = req.cookies

  if (!__backstageApp) {
    throw new Error('The __backstageApp cookie is required')
  }

  if (!__backstageKey) {
    throw new Error('The __backstageKey cookie is required')
  }

  return { app: __backstageApp, key: __backstageKey }
}

export const redirectToPackageMiddleware: RequestHandlerWithPackageIdentifier = (req, res) => {
  const { app, key } = req.packageIdentifier
  res.cookie('__backstageApp', app)
  res.cookie('__backstageKey', key)
  res.redirect('/')
}

const redirectToPackage = express()
redirectToPackage.use(cookieParser())
redirectToPackage.use(redirectToPackageMiddleware)

export const cookie: PackageResolver = { getPackageIdentifierFromRequest, redirectToPackage }
