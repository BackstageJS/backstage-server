import { RequestHandler } from 'express'

export const getFile: (rootDir: string) => RequestHandler = rootDir => (req, res, next) => {
  const { app, key } = req.cookies

  if (app && key) {
    res.sendFile(`${rootDir}/${app}/${key}${req.path}`)
  } else {
    next()
  }
}
