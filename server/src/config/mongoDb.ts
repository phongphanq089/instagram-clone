import { Collection, Db, MongoClient } from 'mongodb'
import env from './environment'
import { Users } from '~/models/schemas/user.schema'

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

  get users(): Collection<Users> {
    return this.db.collection(env.dbUserCollection as string)
  }
  async closeDb() {
    await this.client.close()
  }
}

const databaseService = new DatabaseService()

export default databaseService
