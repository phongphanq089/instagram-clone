import express from 'express'
import { registerController } from '~/controllers/users.controllers'
import { registerValidator } from '~/middlewares/user.middlewares'

const routerUser = express.Router()

/**
 * Description. Register a new user
 * @path /register
 * @Method POST
 * @Body { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
routerUser.post('/register', registerValidator, registerController)

export default routerUser
