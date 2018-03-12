import { RequestHandlerWithPackageIdentifier } from '../../package-resolvers/package-resolver'

export type GetFile = (rootDir: string) => RequestHandlerWithPackageIdentifier

export const getFile: GetFile = rootDir => (req, res) => {
  const { app, key } = req.packageIdentifier
  res.sendFile(`${rootDir}/packages/${app}/${key}${req.path}`)
}
