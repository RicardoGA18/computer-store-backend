import { app } from '../../index'
import supertest from 'supertest'
import User from '../../models/User'

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