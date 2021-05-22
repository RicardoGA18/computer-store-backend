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

describe('/api/clients/deleteById/{clientId}', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    for(let initialUser of initialUsers){
      const intialUserObject = new User(initialUser)
      await intialUserObject.save()
    }
  })

  test('Deleting a client successfully', async () => {
    /* Getting a valid token with id */
    const { token , id } = await validClientTokenWithId()
    /* Making the request */
    const response = await api
      .delete(`/api/clients/deleteById/${id}`)
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content.clientId).toBe(id)
    expect(response.body.message).toBe('Cliente eliminado correctamente')
  })

  test('Checking its using isClient middleware', async () => {
    /* Getting a valid token with id */
    const { token , id } = await invalidClientTokenWithId()
    /* Making the request */
    const response = await api
      .delete(`/api/clients/deleteById/${id}`)
      .set('Authorization', token)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeFalsy()
    expect(response.body.message).toBe('Sesión expirada')
  })

  afterAll(async () => {
    await connection.close()
    server.close()
  })
})