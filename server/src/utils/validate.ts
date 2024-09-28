import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/http-status'
import { EntityErorr, errorWithStatus } from '~/models/errors'

export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validations.run(req)
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      return next()
    }

    const errorObject = errors.mapped()

    const entityErorr = new EntityErorr({ errors: {} })

    for (const key in errorObject) {
      const { msg } = errorObject[key]
      // trả lỗi không phải do validate
      if (msg instanceof errorWithStatus && msg.status !== HTTP_STATUS.UNPROCCESSABLE_ENTITY) {
        return next(msg)
      }
      entityErorr.errors[key] = errorObject[key]
    }
    next(entityErorr)
  }
}
