import { Request } from 'express'
import Users from './models/schemas/user.schema'
import { TokenPayload } from './models/requests/Users.requests'

declare module 'express' {
  interface Request {
    user?: Users
    decoded_authorization?: TokenPayload
    decoded_refreshToken?: TokenPayload
  }
}
