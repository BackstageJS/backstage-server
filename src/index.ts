import * as express from 'express'

import { PackageResolver, RequestWithPackageIdentifier } from './package-resolvers/package-resolver'
import { StorageBackend } from './storage-backends/storage-backend'

export interface ServerConfig {
  packageResolver: PackageResolver
  storageBackend: StorageBackend
}

export const backstage = ({ packageResolver, storageBackend }: ServerConfig): express.Express => {
  const app: express.Express = express()

  if (packageResolver.redirectToPackage) {
    app.use(packageResolver.redirectToPackage)
  }

  app.get('/*',
    (req, _, next) => {
      (req as RequestWithPackageIdentifier).packageIdentifier = packageResolver.getPackageIdentifierFromRequest(req)
      next()
    },
    storageBackend.get,
  )

  app.post(
    '/__backstage/deploy/:app/:key',
    (req, _, next) => {
      (req as RequestWithPackageIdentifier).packageIdentifier = { app: req.params.app, key: req.params.key }
      next()
    },
    storageBackend.deploy,
    (req, res) => {
      const url = packageResolver.getPackageURL(req, { app: req.params.app, key: req.params.key })
      res.send({ message: `Your deploy can now be viewed at ${url}` })
    },
  )
  return app
}
