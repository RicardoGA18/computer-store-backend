import express from 'express'
import { connect } from 'mongoose'
/* Configure dotenv only for development and test environment */
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
/* Routes imports */
import authRoutes from '../routes/auth.routes'

export default class Server {
  constructor() {
    /* Basic configuration */
    this.app = express()
    this.app.use(express.json())
    this.port = process.env.NODE_ENV ==='test'
      ? process.env.PORT_TEST || 8001
      : process.env.PORT || 8000
    /* Database */
    this.mongo_db_uri = process.env.NODE_ENV === 'test' 
      ? process.env.MONGO_DB_URI_TEST
      : process.env.MONGO_DB_URI
    /* Complement config */
    if(process.env.NODE_ENV === 'development'){
      this.app.use(require('morgan')('dev'))
    }
    this.routes()
  }
  start() {
    this.server = this.app.listen(this.port, async () => {
      console.log(`Server running correctly on: http://127.0.0.1:${this.port}`)
      try {
        await connect(this.mongo_db_uri,{
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: true,
          useCreateIndex: true,
        })
        console.log("MongoDB connected correctly")
      } catch (error) {
        console.log(error)
      }
    })
  }
  routes(){
    this.app.use('/api/auth',authRoutes)
  }
}