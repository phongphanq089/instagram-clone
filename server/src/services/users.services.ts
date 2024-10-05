import exp from 'constants'
import { ObjectId } from 'mongodb'
import env from '~/config/environment'
import databaseService from '~/config/mongoDb'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { USER_MESSAGES } from '~/constants/messages'
import { RegisterResBody } from '~/models/requests/Users.requests'
import { RefreshToken } from '~/models/schemas/refreshToken.schema'

import Users from '~/models/schemas/user.schema'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'

class UserService {
  private decodeRefreshToken(refreshToken: string) {
    return verifyToken({
      token: refreshToken,
      secretOrPrivateKey: env.jwtSecret as string
    })
  }
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

  private signPrefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          verify,
          exp
        },
        secretOrPrivateKey: env.jwtSecret as string
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      options: {
        expiresIn: env.refreshTokenExpriesIn
      },
      secretOrPrivateKey: env.jwtSecret as string
    })
  }

  private acsessTokenAndFrefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccsessToken({ user_id, verify }), this.signPrefreshToken({ user_id, verify })])
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

    const [access_token, refresh_token] = await this.acsessTokenAndFrefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })

    const { exp, iat } = await this.decodeRefreshToken(refresh_token as string)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token as string, exp, iat })
    )

    console.log('email_verify_token', email_verify_token)
    return {
      access_token,
      refresh_token
    }
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.acsessTokenAndFrefreshToken({
      user_id: user_id.toString(),
      verify: verify
    })
    const { exp, iat } = await this.decodeRefreshToken(refresh_token as string)

    console.log(new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token as string, exp, iat }))
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token as string, exp, iat })
    )

    return {
      access_token,
      refresh_token
    }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USER_MESSAGES.LOGOUT_SUCCESS
    }
  }
  async refreshToken({
    user_id,
    verify,
    old_refresh_token,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    old_refresh_token: string
    exp: number
  }) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccsessToken({ user_id, verify }),
      this.signPrefreshToken({ user_id, verify, exp }),
      databaseService.refreshTokens.deleteOne({ token: old_refresh_token })
    ])
    const decode_refeshToken = await this.decodeRefreshToken(old_refresh_token as string)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token as string,
        exp: decode_refeshToken.exp,
        iat: decode_refeshToken.iat
      })
    )
    return {
      access_token,
      refresh_token
    }
  }
}

const userService = new UserService()

export default userService
