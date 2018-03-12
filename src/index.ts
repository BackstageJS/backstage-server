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

  app.use(req => {
    (req as RequestWithPackageIdentifier).packageIdentifier = packageResolver.getPackageIdentifierFromRequest(req)
  })

  app.use(storageBackend)
  return app
}
