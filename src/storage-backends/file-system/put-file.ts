import { RequestHandler } from 'express'
import * as fs from 'fs'

export const putFile: (rootDir: string) => RequestHandler = rootDir => (req, res) => {
  fs.writeFile(rootDir + '/payload', req.body.file, console.log)
}
