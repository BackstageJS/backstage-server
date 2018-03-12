import * as cookieParser from 'cookie-parser'
import * as express from 'express'

import {
  PackageIdentifier,
  PackageResolver,
  RequestHandlerWithPackageIdentifier,
} from './package-resolver'

const getPackageIdentifierFromRequest = (req: express.Request): PackageIdentifier => {
  const { app, key } = req.cookies

  if (!app) {
    throw new Error('The app cookie is required')
  }

  if (!key) {
    throw new Error('The key cookie is required')
  }

  return { app, key }
}

export const redirectToPackageMiddleware: RequestHandlerWithPackageIdentifier = (req, res) => {
  const { app, key } = req.packageIdentifier
  res.cookie('app', app)
  res.cookie('key', key)
  res.redirect('/')
}

const redirectToPackage = express()
redirectToPackage.use(cookieParser())
redirectToPackage.use(redirectToPackageMiddleware)

export const cookie: PackageResolver = { getPackageIdentifierFromRequest, redirectToPackage }
