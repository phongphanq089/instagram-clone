import express from 'express'
import env, { isProduction } from './config/environment'
import databaseService from './config/mongoDb'
import { createServer } from 'http'
import { applySecurityMiddlewares } from './config/security'
import routerUser from './routes/users.routes'
import defaultErrorHandle from './middlewares/errors.middlewares'
const app = express()

const httpServer = createServer(app)

app.use(express.json()) // Middleware để parse body JSON
app.use(express.urlencoded({ extended: true })) // Middleware để parse body từ form

applySecurityMiddlewares({ app, isProduction, env })

const startDatabase = async () => {
  if (isProduction) {
    httpServer.listen(process.env.PORT, () => {
      console.log(`Hello ${env.dbUsername}, I am running at ${process.env.PORT}`)
    })
  } else {
    httpServer
      .listen(env.port, () => {
        console.log(`Hello ${env.dbUsername}, I am running at ${env.port}`)
      })
      .on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`Port ${env.port} is already in use. Please use another port.`)
        } else {
          console.error(`Error occurred: ${err.message}`)
        }
      })
  }

  app.use('/users', routerUser)
  app.use(defaultErrorHandle)
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
