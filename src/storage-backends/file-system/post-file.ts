import { RequestHandler } from 'express'
import { mkdir, rename } from 'fs'
import * as tar from 'tar'

export const postFile: (rootDir: string) => RequestHandler = rootDir => (req, res) => {
  const targetDirectory = `${rootDir}/${req.params.app}/${req.params.key}`

  mkdir(targetDirectory, console.error)

  if (req.file.originalname.match(/\.tar\.gz$/)) {
    tar.extract({ cwd: targetDirectory, file: req.file.path })
  } else {
    rename(
      req.file.path,
      `${targetDirectory}/${req.file.originalname}`,
      console.error,
    )
  }
  res.status(201).end()
}
