import { RequestHandler } from 'express'
import * as path from 'path'

export const getStaticFile: RequestHandler = (req, res, next) => {
  if (req.cookies.app && req.cookies.key) {
    res.sendFile(req.path)
  } else {
    next()
  }
}
