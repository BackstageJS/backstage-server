import { NextFunction, Request, RequestHandler, Response } from 'express'

export interface PackageIdentifier {
  app: string
  key: string
}

export interface RequestWithPackageIdentifier extends Request {
  packageIdentifier?: PackageIdentifier
}

export interface RequestHandlerWithPackageIdentifier extends RequestHandler {
  (req: RequestWithPackageIdentifier, res: Response, next: NextFunction): void
}

export interface PackageResolver {
  redirectToPackage: RequestHandler
  getPackageIdentifierFromRequest(req: Request): PackageIdentifier
}
