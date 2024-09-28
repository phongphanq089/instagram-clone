import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'

// Lấy biến NODE_ENV
const envConfig = process.env.NODE_ENV

// Tạo đường dẫn đến file .env tương ứng
const envFilename = path.resolve(__dirname, `../.env.${envConfig}`)

// Kiểm tra nếu không có NODE_ENV
if (!envConfig) {
  console.error(`Lỗi: Bạn chưa cung cấp biến môi trường NODE_ENV (ví dụ: development, production)`)
  process.exit(1)
}
console.log(`Phát hiện NODE_ENV = ${envConfig}, file môi trường sẽ là ${envFilename}`)

// Kiểm tra sự tồn tại của file .env.<environment>
if (!fs.existsSync(envFilename)) {
  console.error(`Không tìm thấy file môi trường ${envFilename}`)
  console.error(`Vui lòng tạo file ${envFilename}, hoặc tham khảo .env.example`)
  process.exit(1)
}

// Load các biến môi trường từ file .env.<environment>
config({ path: envFilename })

// Kiểm tra các biến môi trường quan trọng
if (!process.env.DB_NAME || !process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
  console.error('Lỗi: Thiếu một hoặc nhiều biến môi trường quan trọng như DB_NAME, DB_USERNAME, DB_PASSWORD')
  process.exit(1)
}

// Xác định ứng dụng có đang chạy ở môi trường production không
export const isProduction = envConfig === 'production'

// Sử dụng fallback cho PORT với giá trị mặc định là 3000 nếu không có giá trị nào khác
const PORT = process.env.PORT || process.env.APP_PORT || 3000

export const env = {
  port: PORT,
  dbName: process.env.DB_NAME,
  dbPassword: process.env.DB_PASSWORD,
  dbUsername: process.env.DB_USERNAME,
  dbUserCollection: process.env.DB_USER_COLLECTION,
  clientUrl: process.env.CLIENT_URL,
  passwordSecret: process.env.PASSWORD_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  refeshTokenExpriesIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  accessTokenExpriesIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  emailVerifyTokenExpriesIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN,
  forgotPasswordTokenExpriesIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
}

export default env
