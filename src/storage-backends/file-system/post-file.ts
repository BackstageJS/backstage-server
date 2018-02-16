import { RequestHandler } from 'express'
import { mkdir, rename, rmdir } from 'fs'
import * as tar from 'tar'

export const postFile: (rootDir: string) => RequestHandler = rootDir => (req, res) => {
  const targetDirectory = `${rootDir}/${req.params.app}/${req.params.key}`
  rmdir(targetDirectory, () => null)
  mkdir(targetDirectory, () => null)
  tar.extract({ cwd: targetDirectory, file: req.file.path })
  res.status(201).end()
}
