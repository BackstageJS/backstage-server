import { RequestHandler } from 'express'
import { rename } from 'fs'

export const postFile: (rootDir: string) => RequestHandler = rootDir => (req, res) => {
  rename(
    req.file.path,
    `${rootDir}/${req.params.app}/${req.params.key}/${req.file.originalname}`,
    console.error,
  )
  res.status(201).end()
}
