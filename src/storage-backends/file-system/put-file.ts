import { RequestHandler } from 'express'

export const putFile: (rootDir: string) => RequestHandler = rootDir => (req, res, next) => {
  next()
}
