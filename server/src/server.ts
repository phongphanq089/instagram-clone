import express from 'express'
import env, { isProduction } from './config/environment'
import databaseService from './config/mongoDb'
import { createServer } from 'http'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cors, { CorsOptions } from 'cors'

const app = express()
const httpServer = createServer(app)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

app.use(helmet())

const corsOptions: CorsOptions = {
  origin: isProduction ? env.clientUrl : '*'
}
app.use(cors(corsOptions))

const startDatabase = async () => {
  console.log('Starting database')

  if (isProduction) {
    httpServer.listen(process.env.PORT, () => {
      console.log(`Hello ${env.dbUsername}, I am running at ${process.env.PORT}`)
    })
  } else {
    httpServer.listen(env.port, () => {
      console.log(`Hello ${env.dbUsername}, I am running at ${env.port}`)
    })
  }
}

// ========|| DATABASE SERVER || ===========//
databaseService
  .connect()
  .then(() => console.log('connected to mongodb database'))
  .then(() => startDatabase())
  .catch(() => {
    console.error('Failed to start database')
    process.exit(1)
  })

app.listen(env.port, () => {
  console.log(`App listening on port ${env.port}`)
})
