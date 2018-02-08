import { RequestHandler } from 'express'
import * as path from 'path'

import { StorageBackend } from './app'

export const getStaticFile: (rootDir: string) => StorageBackend = rootDir => (req, res, next) => {
  const { app, key } = req.cookies

  if (app && key) {
    res.sendFile(`${rootDir}/${app}/${key}${req.path}`)
  } else {
    next()
  }
}
