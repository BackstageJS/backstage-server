import { RequestHandler } from 'express'
import * as fs from 'fs'

export const postFile: (rootDir: string) => RequestHandler = rootDir => (req, res) => {
  res.status(201).end()
}
