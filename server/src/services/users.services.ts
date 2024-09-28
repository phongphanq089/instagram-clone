import { ObjectId } from 'mongodb'
import env from '~/config/environment'
import databaseService from '~/config/mongoDb'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { RegisterResBody } from '~/models/requests/Users.requests'
import Users from '~/models/schemas/user.schema'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

class UserService {
  private signAccsessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccsessToken,
        verify
      },
      options: {
        expiresIn: env.accessTokenExpriesIn
      },
      secretOrPrivateKey: env.jwtSecret as string
    })
  }

  private signPrefeshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefeshToken,
          verify,
          exp
        },
        secretOrPrivateKey: env.jwtSecret as string
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefeshToken,
        verify
      },
      options: {
        expiresIn: env.refeshTokenExpriesIn
      },
      secretOrPrivateKey: env.jwtSecret as string
    })
  }

  private acsessTokenAndFrefeshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccsessToken({ user_id, verify }), this.signPrefeshToken({ user_id, verify })])
  }
  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      options: {
        expiresIn: env.emailVerifyTokenExpriesIn
      },
      secretOrPrivateKey: env.jwtSecret as string
    })
  }

  async checkMailExit(email: string) {
    const isEmail = await databaseService.users.findOne({ email })
    return Boolean(isEmail)
  }

  async register(payload: RegisterResBody) {
    const user_id = new ObjectId()

    const email_verify_token = (await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })) as string
    await databaseService.users.insertOne(
      new Users({
        ...payload,
        _id: user_id,
        username: `user_${user_id}`,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    const [access_token, refresh_token] = await this.acsessTokenAndFrefeshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })

    console.log('email_verify_token', email_verify_token)
    return {
      access_token,
      refresh_token
    }
  }
}

const userService = new UserService()

export default userService
