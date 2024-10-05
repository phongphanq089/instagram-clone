import express from 'express'
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const routerUser = express.Router()

/**
 * Description. Register a new user
 * @path /register
 * @Method POST
 * @Body { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
routerUser.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description. Login user
 * @path /login
 * @Method POST
 * @Body { email: string, password: string}
 */
routerUser.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description. Logout a user
 * @path /logout
 * @Method POST
 * @Header { Authorization: Bearer <access_token> }
 * @Body { refresh_token: string }
 */

routerUser.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description. refresh-token
 * @path /refresh-token
 * @Method POST
 * @Body { refresh-token: string}
 */

routerUser.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

export default routerUser
