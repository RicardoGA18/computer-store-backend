import User from '../../models/User'
import { server } from '../../index'
import { connection } from 'mongoose'
import {
  api,
  initialUsers,
  getUsersContent,
  validClientToken,
  validAdminToken,
  invalidAdminToken,
  validClientTokenWithId,
  invalidClientTokenWithId,
} from '../helpers'

describe('Get clients => /api/clients', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    for(let initialUser of initialUsers){
      const intialUserObject = new User(initialUser)
      await intialUserObject.save()
    }
  })

  describe('/getAll', () => {
    test('Getting all clients successfully', async () => {
      /* Getting a valid token */
      const token = await validAdminToken()
      /* Making the request */
      const response = await api
        .get('/api/clients/getAll')
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeTruthy()
      expect(response.body.message).toBe('Clientes obtenidos exitosamente')
      for(let client of response.body.content){
        expect(client.role).toBe('client')
      }
    })

    test('checking its using the isAdmin middleware', async () => {
      /* Getting a valid token */
      const token = await invalidAdminToken()
      /* Making the request */
      const response = await api
        .get('/api/clients/getAll')
        .set('Authorization', token)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Sesión expirada')
    })
  })

  describe('/getById/{clientId}', () => {
    test('Getting client by id successfully', async () => {
      /* Getting the token with id */
      const { token , id } = await validClientTokenWithId()
      /* Making the request */
      const response = await api
        .get(`/api/clients/getById/${id}`)
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeTruthy()
      expect(response.body.content._id).toBe(id)
      expect(response.body.message).toBe('Cliente obtenido correctamente')
    })

    test('Can not get a client without token', async () => {
      /* Making the request without token */
      const response = await api
        .get(`/api/clients/getById/asdsad`)
        .expect(403)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('No se recibió el token de acceso')
    })

    test('Client can not get info of another client', async () => {
      /* Getting the token */
      const token = await validClientToken()
      /* Making the request with invalid id */
      const response = await api
        .get(`/api/clients/getById/asdsad`)
        .set('Authorization', token)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Usuario no autorizado')
    })

    test('Admin can get info of any client', async () => {
      /* Getting token admin and client id */
      const token = await validAdminToken()
      const clients = await getUsersContent()
      const clientId = clients[0]._id.toString()
      /* Making the request */
      const response = await api
        .get(`/api/clients/getById/${clientId}`)
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeTruthy()
      expect(response.body.message).toBe('Cliente obtenido correctamente')
    })

    test('Can not get a client with an invalid token', async () => {
      /* Getting invalid token client and client id */
      const { token , id } = await invalidClientTokenWithId()
      /* Making the request */
      const response = await api
        .get(`/api/clients/getById/${id}`)
        .set('Authorization', token)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Sesión expirada')
    })
  })

  afterAll(async () => {
    await connection.close()
    server.close()
  })
})