import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/http-status'
import { errorWithStatus } from '~/models/errors'

const defaultErrorHandle = (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err instanceof errorWithStatus) {
      return res.status(err.status).json(omit(err, ['status']))
    }
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      errorInfo: omit(error as any, ['stack'])
    })
  }
}

export default defaultErrorHandle
