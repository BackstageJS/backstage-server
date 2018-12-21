import * as fs from 'fs'
import { RequestHandlerWithPackageIdentifier } from '../../package-resolvers/package-resolver'

export type GetFile = (rootDir: string) => RequestHandlerWithPackageIdentifier

export const getFile: GetFile = rootDir => (req, res) => {
  const { app, key } = req.packageIdentifier

  const basePath = `${rootDir}/packages/${app}/${key}`
  if (fs.existsSync(basePath + req.path)) {
    res.sendFile(basePath + req.path)
  } else {
    res.sendFile(`${basePath}/index.html`)
  }
}
