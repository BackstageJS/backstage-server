import * as cookieParser from 'cookie-parser'
import * as express from 'express'

const app = express()
app.use(cookieParser())

// tslint:disable-next-line:no-console
app.listen(3000, () => console.log('App listening on port 3000'))
