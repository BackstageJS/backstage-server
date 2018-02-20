import { RequestHandler } from 'express'
import { existsSync, mkdirSync, rename, rmdirSync } from 'fs'
import { sync as rimrafSync } from 'rimraf'
import * as tar from 'tar'

export const postFile: (rootDir: string) => RequestHandler = rootDir => (req, res) => {
  const app = req.params.app.replace(/\W/g, '-')
  const key = req.params.key.replace(/\W/g, '-')

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
