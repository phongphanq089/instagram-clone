import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/http-status'
import { USER_MESSAGES } from '~/constants/messages'
import userService from '~/services/users.services'

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  await userService.register(req.body)
  return res.status(HTTP_STATUS.OK).json({
    messages: USER_MESSAGES.REGISTER_SUCCESS
  })
}
