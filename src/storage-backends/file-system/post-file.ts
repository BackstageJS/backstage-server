import { NextFunction, Response } from 'express'
import { existsSync, mkdirSync } from 'fs'
import { sync as rimrafSync } from 'rimraf'
import * as tar from 'tar'

import { sanitizeName } from '../../helpers'
import {
  RequestHandlerWithPackageIdentifier,
  RequestWithPackageIdentifier,
} from '../../package-resolvers/package-resolver'

export type PostFile = (rootDir: string) => RequestHandlerWithPackageIdentifier
export const postFile: PostFile = rootDir => (req: RequestWithPackageIdentifier, res: Response, next: NextFunction) => {
  const app = sanitizeName(req.packageIdentifier.app)
  const key = sanitizeName(req.packageIdentifier.key)

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

  res.status(201)
  next()
}
