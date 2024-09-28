import cors, { CorsOptions } from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { Express } from 'express'
import compression from 'compression'
import morgan from 'morgan'

interface Options {
  app: Express
  isProduction: boolean
  env: {
    clientUrl?: string
  }
}

export const applySecurityMiddlewares = ({ app, isProduction, env }: Options) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Giới hạn mỗi IP được gửi tối đa 100 yêu cầu trong 15 phút
    standardHeaders: true, // Trả về thông tin giới hạn trong header chuẩn `RateLimit-*`
    legacyHeaders: false // Tắt các header `X-RateLimit-*` cũ
  })

  const corsOptions: CorsOptions = {
    origin: isProduction ? env.clientUrl : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Chỉ cho phép các method cụ thể nếu cần
    credentials: true // Nếu muốn cho phép chia sẻ cookie giữa client và server
  }
  app.use(cors(corsOptions))
  app.use(limiter)
  app.use(helmet())
  app.use(compression()) // Nén các response để giảm băng thông
  app.use(morgan('combined')) // Log các request đến
}
