import * as cookieParser from 'cookie-parser'
import * as express from 'express'

import { getStaticFile } from './getStaticFile'
import { setPackageFromQueryParams } from './setPackageFromQueryParams'

const app = express()
app.use(cookieParser())
app.use(setPackageFromQueryParams)
app.use(getStaticFile)

// tslint:disable-next-line:no-console
app.listen(3000, () => console.log('App listening on port 3000'))
