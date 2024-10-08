import HTTP_STATUS from '~/constants/http-status'
import { USER_MESSAGES } from '~/constants/messages'

type ErrorType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class errorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityErorr extends errorWithStatus {
  errors: ErrorType
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor({ message, errors }: { message?: string; errors: ErrorType }) {
    super({ message: USER_MESSAGES.VALIDATION_ERROR, status: HTTP_STATUS.UNPROCCESSABLE_ENTITY })
    this.errors = errors
  }
}
