import { app } from '../../index'
import supertest from 'supertest'
import User from '../../models/User'
import Category from '../../models/Category'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const api = supertest(app)

/* Users */
export const initialUsers = [
  {
    name: 'admin',
    lastName: 'asdasd',
    email: 'admin@example.net',
    role: 'admin',
    password: User.encryptPassword('adminpass123'),
    decodePass: 'adminpass123',
  },
  {
    name: 'user',
    lastName: 'example',
    email: 'user@example.net',
    password: User.encryptPassword('userpass123'),
    decodePass: 'userpass123',
  }
]

export const exampleUser = {
  name: 'John',
  lastName: 'Doe',
  email: 'JohnDoe@example.net',
  password: 'asd123',
  avatar: 'https://image.shutterstock.com/image-photo/word-example-written-on-magnifying-260nw-1883859943.jpg',
}

export const getUsersContent = async () => {
  const users = await User.find({})
  const allUsers = users.map(user => user.toJSON())
  return allUsers
}

/* Auth */
export const validClientToken = async () => {
  const clientObject = await User.findOne({role: 'client'})
  const client = clientObject.toJSON()
  const token = jwt.sign({userId: client._id},process.env.JWT_SECRET,{
    expiresIn: 60 * 60 * 24 * 15 // 15 days
  })
  return `Bearer ${token}`
}

export const invalidClientToken = async () => {
  const clientObject = await User.findOne({role: 'user'})
  const client = clientObject.toJSON()
  const token = jwt.sign({userId: client._id},process.env.JWT_SECRET,{
    expiresIn: 0
  })
  return `Bearer ${token}`
} 

export const validAdminToken = async () => {
  const adminObject = await User.findOne({role: 'admin'})
  const admin = adminObject.toJSON()
  const token = jwt.sign({userId: admin._id},process.env.JWT_SECRET,{
    expiresIn: 60 * 60 * 24 * 15 // 15 days
  })
  return `Bearer ${token}`
}

export const invalidAdminToken = async () => {
  const adminObject = await User.findOne({role: 'admin'})
  const admin = adminObject.toJSON()
  const token = jwt.sign({userId: admin._id},process.env.JWT_SECRET,{
    expiresIn: 0
  })
  return `Bearer ${token}`
}

export const decodeToken = token => {
  try {
    const info = jwt.verify( token , process.env.JWT_SECRET )
    return info
  } catch (error) {
    return null
  }
}

/* Categories */
export const initialCategories = [
  {
    name: 'CPU',
    img: 'https://images-na.ssl-images-amazon.com/images/I/41m3LUm33sL._AC_.jpg',
  },
  {
    name: 'GPU',
    img: 'https://www.profesionalreview.com/wp-content/uploads/2017/04/C%C3%B3mo-entender-las-especificaciones-de-la-tarjeta-gr%C3%A1fica-3.jpg',
  },
]

export const getCategoriesContent = async () => {
  const categories = await Category.find({})
  const allCategories = categories.map(category => category.toJSON())
  return allCategories
}