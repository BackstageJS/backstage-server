import { RequestHandler } from 'express'
import { rename } from 'fs'
import * as tar from 'tar'

export const postFile: (rootDir: string) => RequestHandler = rootDir => (req, res) => {
  const targetDirectory = `${rootDir}/${req.params.app}/${req.params.key}`
  if (req.file.originalname.match(/\.tar\.gz$/)) {
    tar.extract({ file: req.file.path, C: targetDirectory })
  } else {
    rename(
      req.file.path,
      `${targetDirectory}/${req.file.originalname}`,
      console.error,
    )
  }
  res.status(201).end()
}
