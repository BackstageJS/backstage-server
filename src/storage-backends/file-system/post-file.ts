import { RequestHandler } from 'express'
import { mkdir, rename, rmdir } from 'fs'
import * as tar from 'tar'

export const postFile: (rootDir: string) => RequestHandler = rootDir => (req, res) => {
  const app = req.params.app.replace(/\W/g, '-')
  const key = req.params.key.replace(/\W/g, '-')
  const targetDirectory = `${rootDir}/${app}/${key}`

  rmdir(targetDirectory, () => null)
  mkdir(targetDirectory, () => null)

  tar.extract({ cwd: targetDirectory, file: req.file.path })

  const url = `${req.protocol}://${req.get('host')}/?app=${app}&key=${key}`
  res.status(201).send({
    message: `Your deploy can now be viewed at ${url}`,
  })
}
