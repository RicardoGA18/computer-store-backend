import Category from '../../models/Category'
import User from '../../models/User'
import { server } from '../../index'
import { connection } from 'mongoose'
import { 
  api,
  initialCategories,
  validAdminToken,
  invalidAdminToken,
  validClientToken,
  initialUsers,
} from '../helpers'

describe('/api/categories/create', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Category.deleteMany({})
    for(let initialCategory of initialCategories){
      const initialCategoryObject = new Category(initialCategory)
      await initialCategoryObject.save()
    }
    for(let initialUser of initialUsers){
      const initialUserObject = new User(initialUser)
      await initialUserObject.save()
    }
  })

  test('Create a category successfully as an admin', async () => {
    /* Generating a valid token as an admin */
    const token = await validAdminToken()
    /* Making the request with the token */
    const response = await api
      .post('/api/categories/create')
      .send({name: 'category example'})
      .set('x-access-token', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    /* Verifying the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content.img).toBe('https://firebasestorage.googleapis.com/v0/b/computer-store-a1f8e.appspot.com/o/assets%2FGroup%202.png?alt=media&token=0c75a57c-5005-4efb-b4e8-82a69b5c8849')
    expect(response.body.content.name).toBe('category example')
    expect(response.body.message).toBe('Categoria creada exitosamente.')
  })

  describe('User can not create a category with an invalid token', () => {
    test('without token', async () => {
      /* Making the request without token */
      const response = await api
        .post('/api/categories/create')
        .send({name: 'category example'})
        .expect(400)
        .expect('Content-Type', /application\/json/)

      /* Checking the reponse */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('No se recibió el token de acceso')
    })

    test('with an expired token', async () => {
      /* Getting an invalid token */
      const token = await invalidAdminToken()
      /* Making the request with an expired token */
      const response = await api
        .post('/api/categories/create')
        .send({name: 'category example'})
        .set('x-access-token', token)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Sesión expirada')
    })

    test('with a no token string', async () => {
      /* Making the request with an invalid token */
      const response = await api
        .post('/api/categories/create')
        .send({name: 'category example'})
        .set('x-access-token', 'asdasdasdasdasd')
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Token de acceso inválido')
    })
  })

  test('User with the client role can not create a category', async () => {
    /* Getting the token as a client */
    const token = await validClientToken()
    /* Making the request as a user */
    const response = await api
      .post('/api/categories/create')
      .send({name: 'category example'})
      .set('x-access-token', token)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  
    /* Checking the response */
    expect(response.body.success).toBeFalsy()
    expect(response.body.message).toBe('Usuario no autorizado')
  })

  test('Category without name can not be added', async () => {
    /* Generating a valid token as an admin */
    const token = await validAdminToken()
    /* Making the request with the token */
    const response = await api
      .post('/api/categories/create')
      .send({})
      .set('x-access-token', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    /* Checking the response */
    expect(response.body.success).toBeFalsy()
    expect(response.body.message).toBe('El campo name es requerido')
  })

  test('Category with an invalid name can not be added', async () => {
    /* Generating a valid token as an admin */
    const token = await validAdminToken()
    /* Making the request with the token */
    const response = await api
      .post('/api/categories/create')
      .send({name: 123})
      .set('x-access-token', token)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    /* Checking the response */
    expect(response.body.success).toBeFalsy()
    expect(response.body.message).toBe('El campo name debe ser string')
  })

  afterAll(async () => {
    await connection.close()
    server.close()
  })
})