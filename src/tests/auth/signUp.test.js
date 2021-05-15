import User from '../../models/User'
import { server } from '../../index'
import { connection } from 'mongoose'
import { api , initialUsers , getUsersContent , exampleUser } from '../helpers' 

describe('/api/auth/sign-up', () => {
  beforeAll(async () => {
    await Promise.all(initialUsers.map((initialUser)=>{
      User.create(initialUser)
    }))
  })
describe('Validate token', ()=>{
  it('Creating a user successfully and receive a token', async () => {
    /* Getting users at init */
    const usersAtStart = await getUsersContent()

    /* Creating new user */
    const response = await api
      .post('/api/auth/sign-up')
      .send(exampleUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    /* Checking success is true and token exists */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content.token).toBeDefined()

    /* Getting users at end */
    const usersAtEnd = await getUsersContent()

    /* Checking there is a new User */
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 3)

    /* Checking the email of the new user is in the database */
    const emails = usersAtEnd.map(user => user.email)
    expect(emails).toContain(exampleUser.email)
  })

})

  describe('User without a required field is not added', () => {
    it('without name', async () => {
      /* Making the request without name */
      const response = await api
        .post('/api/auth/sign-up')
        .send({ ...exampleUser , name: null })
        .expect(400)
        .expect('Content-Type', /application\/json/)
      /* Expect to have the correct error message */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toMatch(/campo.*requerido/)
    })
    it('without lastName', async () => {
      /* Making the request without name */
      const response = await api
        .post('/api/auth/sign-up')
        .send({ ...exampleUser , lastName: null })
        .expect(400)
        .expect('Content-Type', /application\/json/)
      /* Expect to have the correct error message */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toMatch(/campo.*requerido/)
    })
    it('without email', async () => {
      /* Making the request without name */
      const response = await api
        .post('/api/auth/sign-up')
        .send({ ...exampleUser , email: null })
        .expect(400)
        .expect('Content-Type', /application\/json/)
      /* Expect to have the correct error message */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toMatch(/campo.*requerido/)
    })
    it('without password', async () => {
      /* Making the request without name */
      const response = await api
        .post('/api/auth/sign-up')
        .send({ ...exampleUser , password: null })
        .expect(400)
        .expect('Content-Type', /application\/json/)
      /* Expect to have the correct error message */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toMatch(/campo.*requerido/)
    })
  })
  
  describe('User with an invalid field is not added',() => {
    it('invalid name', async () => {
      /* Making the request with an invalid name */
      const response = await api
        .post('/api/auth/sign-up')
        .send({...exampleUser , name: 123456})
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('El campo name debe ser string')
    })
    it('invalid lastName', async () => {
      /* Making the request with an invalid lastName */
      const response = await api
        .post('/api/auth/sign-up')
        .send({...exampleUser , lastName: 'John123'})
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('El apellido es inválido')
    })
    it('invalid email', async () => {
      /* Making the request with an invalid email */
      const response = await api
        .post('/api/auth/sign-up')
        .send({...exampleUser , email: 'ricardo@example'})
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('El email es inválido')
    })
    it('invalid password', async () => {
      /* Making the request with an invalid password */
      const response = await api
        .post('/api/auth/sign-up')
        .send({...exampleUser , password: 'asd'})
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('La contraseña debe tener 6 caracteres como mínimo')
    })
    it('invalid url avatar', async () => {
      /* Making the request with an invalid url avatar */
      const response = await api
        .post('/api/auth/sign-up')
        .send({...exampleUser , avatar: 'google.com'})
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('La URL del avatar es inválida')
    })
    it('invalid role', async () => {
      /* Making the request with an invalid role */
      const response = await api
        .post('/api/auth/sign-up')
        .send({...exampleUser , role: 'moderator'})
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('EL rol moderator no existe')
    })
  })
  describe('Validate user',()=>{
    it('User with an existing email is not added', async () => {
      const response = await api
        .post('/api/auth/sign-up')
        .send({...exampleUser , email: initialUsers[0].email})
        .expect(409)
        .expect('Content-Type', /application\/json/)
  
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe(`El email ${initialUsers[0].email} ya existe`)
    })

  })

  afterAll(async () => {
    await User.deleteMany()
    await connection.close()
    server.close()
  })
})

