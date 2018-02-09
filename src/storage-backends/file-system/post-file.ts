import { RequestHandler } from 'express'
import * as fs from 'fs'

export const postFile: (rootDir: string) => RequestHandler = rootDir => (req, res) => {
  fs.writeFile(rootDir + '/payload', req.file, console.log)
}
