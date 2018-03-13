import * as express from 'express'

import { sanitizeName } from '../../helpers'
import { PackageIdentifier, PackageResolver } from '../package-resolver'

const getPackageIdentifierFromRequest = (req: express.Request): PackageIdentifier => {
  const [key, app] = req.hostname.split('.')
  return { app, key }
}

const getPackageURL = (req: express.Request, packageIdentifier: PackageIdentifier): string => {
  let { app, key } = packageIdentifier
  app = sanitizeName(app)
  key = sanitizeName(key)
  return `${req.protocol}://${key}.${app}.${req.get('host')}`
}

export const subdomain: PackageResolver = { getPackageIdentifierFromRequest, getPackageURL }
