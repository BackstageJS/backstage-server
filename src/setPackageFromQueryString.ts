import { RequestHandler } from 'express'

export const setPackageFromQueryString: RequestHandler = (req, res, next) => {
  const { app, key } = req.params
  if (app && key) {
    res.cookie('app', app)
    res.cookie('key', key)
    res.redirect(req.path)
  } else {
    next()
  }
}
