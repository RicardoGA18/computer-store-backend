import express from 'express'
import { connect } from 'mongoose'
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from './swagger.json'
import cors from 'cors'
/* Configure dotenv only for development and test environment */
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
/* Routes imports */
import authRoutes from '../routes/auth.routes'
import categoryRoutes from '../routes/categories.routes'
import productRoutes from '../routes/products.routes'
import clientRoutes from '../routes/clients.routes'

export default class Server {
  constructor() {
    /* Basic configuration */
    this.app = express()
    this.cors()
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
    this.swagger()
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
  swagger(){
    this.app.use('/api/docs',swaggerUi.serve,swaggerUi.setup(swaggerDoc))
  }
  cors(){
    this.app.use(cors({
      origin: '*',
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      allowedHeaders: ['Content-Type', 'Authorization']
    }))
  }
  routes(){
    this.app.use('/api/auth', authRoutes)
    this.app.use('/api/categories', categoryRoutes)
    this.app.use('/api/products', productRoutes)
    this.app.use('/api/clients',clientRoutes)
  }
}