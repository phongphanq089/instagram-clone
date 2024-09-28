import { ObjectId } from 'mongodb'
import databaseService from '~/config/mongoDb'
import { RegisterResBody } from '~/models/requests/Users.requests'
import { Users } from '~/models/schemas/user.schema'
import { hashPassword } from '~/utils/crypto'

class UserService {
  async checkMailExit(email: string) {
    const isEmail = await databaseService.users.findOne({ email })
    return Boolean(isEmail)
  }
  async register(payload: RegisterResBody) {
    const user_id = new ObjectId()
    await databaseService.users.insertOne(
      new Users({
        ...payload,
        _id: user_id,
        username: `user_${user_id}`,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
  }
}

const userService = new UserService()

export default userService
