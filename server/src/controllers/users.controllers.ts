import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/http-status'
import { USER_MESSAGES } from '~/constants/messages'
import {
  LoginResBody,
  LogoutResBody,
  refreshTokenResBody,
  RegisterResBody,
  TokenPayload
} from '~/models/requests/Users.requests'
import Users from '~/models/schemas/user.schema'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterResBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.register(req.body)
  return res.status(HTTP_STATUS.OK).json({
    messages: USER_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginResBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as Users
  const user_id = user._id as ObjectId
  const result = await userService.login({ user_id: user_id.toString(), verify: user.verify })
  return res.status(HTTP_STATUS.OK).json({
    messages: USER_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutResBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await userService.logout(refresh_token)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, refreshTokenResBody>,
  res: Response
) => {
  const { refresh_token: old_refresh_token } = req.body
  const { user_id, verify, exp } = req.decoded_refreshToken as TokenPayload
  const result = await userService.refreshToken({ user_id, verify, old_refresh_token, exp })
  return res.json(result)
}
