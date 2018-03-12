import { RequestHandler } from 'express'

export interface StorageBackend {
  get: RequestHandler
  deploy: RequestHandler
}
