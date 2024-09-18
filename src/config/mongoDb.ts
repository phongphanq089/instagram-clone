import { Db, MongoClient } from 'mongodb'
import env from './environment'

const uri = `mongodb+srv://${env.dbUsername}:${env.dbPassword}@phongphan.44sod.mongodb.net/?retryWrites=true&w=majority&appName=phongphan`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(env.dbName)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      console.log('Error', err)
      throw err
    }
  }
  async closeDb() {
    await this.client.close()
  }
}

const databaseService = new DatabaseService()

export default databaseService
