import { RequestHandler } from 'express'
import { StorageBackend } from '../../app'

export const getFile: (rootDir: string) => StorageBackend = rootDir => (req, res, next) => {
  const { app, key } = req.cookies

  if (app && key) {
    res.sendFile(`${rootDir}/${app}/${key}${req.path}`)
  } else {
    next()
  }
}
