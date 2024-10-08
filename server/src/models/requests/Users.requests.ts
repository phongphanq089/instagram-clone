import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'

export interface LoginResBody {
  refresh_token: string
}

export interface LogoutResBody {
  refresh_token: string
}
export interface refreshTokenResBody {
  refresh_token: string
}

export interface RegisterResBody {
  name: string
  email: string
  password: string
  confirmPassword: string
  date_of_birth: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}
