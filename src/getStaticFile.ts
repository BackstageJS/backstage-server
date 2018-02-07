import { RequestHandler } from 'express'
import * as path from 'path'

export const getStaticFile: RequestHandler = (req, res, next) => {
  const { app, key } = req.cookies

  if (app && key) {
    const rootDir = path.join(__dirname, '../files')
    res.sendFile(`${rootDir}/${app}/${key}${req.path}`)
  } else {
    next()
  }
}
