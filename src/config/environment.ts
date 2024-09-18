import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'

const envConfig = process.env.NODE_ENV
const envFilename = `.env.${envConfig}`

if (!envConfig) {
  console.log(`Bạn chưa cung cấp biến môi trường NODE_ENV (ví dụ: development, production)`)
  console.log(`Phát hiện NODE_ENV = ${envConfig}`)
  process.exit(1)
}
console.log(`Phát hiện NODE_ENV = ${envConfig}, vì thế app sẽ dùng file môi trường là ${envFilename}`)
if (!fs.existsSync(path.resolve(envFilename))) {
  console.log(`Không tìm thấy file môi trường ${envFilename}`)
  console.log(`Lưu ý: App không dùng file .env, ví dụ môi trường là development thì app sẽ dùng file .env.development`)
  console.log(`Vui lòng tạo file ${envFilename} và tham khảo nội dung ở file .env.example`)
  process.exit(1)
}

config({
  path: envFilename
})
export const isProduction = envConfig === 'production'

export const env = {
  port: process.env.APP_PORT,
  dbName: process.env.DB_NAME,
  dbPassword: process.env.DB_PASSWORD,
  dbUsername: process.env.DB_USERNAME,
  clientUrl: process.env.CLIENT_URL
}

export default env
