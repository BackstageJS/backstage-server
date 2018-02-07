import { RequestHandler } from 'express'

export const setPackageCookies: RequestHandler = (req, res, next) => {
  const { app, key } = req.query
  if (app && key) {
    res.cookie('app', app)
    res.cookie('key', key)
    res.redirect('/')
  } else {
    next()
  }
}
