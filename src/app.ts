import * as cookieParser from 'cookie-parser'
import * as express from 'express'

import { getStaticFile } from './getStaticFile'

const app = express()
app.use(cookieParser())
app.use(getStaticFile)

// tslint:disable-next-line:no-console
app.listen(3000, () => console.log('App listening on port 3000'))
