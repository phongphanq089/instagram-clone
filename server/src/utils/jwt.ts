import jwt from 'jsonwebtoken'

export const signToken = ({
  payload,
  secretOrPrivateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | object | Buffer
  secretOrPrivateKey: string
  options?: jwt.SignOptions
}) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}
