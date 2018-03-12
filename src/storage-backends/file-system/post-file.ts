import { Response } from 'express'
import { existsSync, mkdirSync } from 'fs'
import { sync as rimrafSync } from 'rimraf'
import * as tar from 'tar'

import {
  RequestHandlerWithPackageIdentifier,
  RequestWithPackageIdentifier,
} from '../../package-resolvers/package-resolver'

export type PostFile = (rootDir: string) => RequestHandlerWithPackageIdentifier
export const postFile: PostFile = rootDir => (req: RequestWithPackageIdentifier, res: Response) => {
  const app = req.packageIdentifier.app.replace(/\W/g, '-')
  const key = req.packageIdentifier.key.replace(/\W/g, '-')

  const appDirectory = `${rootDir}/packages/${app}`
  if (!existsSync(appDirectory)) {
    mkdirSync(appDirectory)
  }

  const keyDirectory = `${appDirectory}/${key}`
  if (existsSync(keyDirectory)) {
    rimrafSync(keyDirectory)
  }
  mkdirSync(keyDirectory)

  tar.extract({ cwd: keyDirectory, file: req.file.path })

  const url = `${req.protocol}://${req.get('host')}/__backstage/go/${app}/${key}`
  res.status(201).send({
    message: `Your deploy can now be viewed at ${url}`,
  })
}
