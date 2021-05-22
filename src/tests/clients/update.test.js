import User from '../../models/User'
import { server } from '../../index'
import { connection } from 'mongoose'
import {
  api,
  initialUsers,
  validClientTokenWithId,
  invalidClientTokenWithId,
} from '../helpers'

describe('/api/clients/updateById/{clientId}', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    for(let initialUser of initialUsers){
      const intialUserObject = new User(initialUser)
      await intialUserObject.save()
    }
  })

  test('Update a client successfully', async () => {
    /* Generating token with id */
    const { token , id } = await validClientTokenWithId()
    /* Making the request */
    const response = await api
      .put(`/api/clients/updateById/${id}`)
      .send({name: 'updated', lastName: 'client', email: 'client@update.com'})
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content._id).toBe(id)
    expect(response.body.content.name).toBe('updated')
    expect(response.body.message).toBe('Cliente actualizado correctamente')
  })

  test('Checking its using isClient middleware', async () => {
    /* Generating invalid token */
    const { token , id } = await invalidClientTokenWithId()
    /* Making the request */
    const response = await api
      .put(`/api/clients/updateById/${id}`)
      .send({name: 'updated', lastName: 'client', email: 'client@update.com'})
      .set('Authorization', token)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeFalsy()
    expect(response.body.message).toBe('Sesión expirada')
  })

  test('Checking its using validateUpdateClient middleware', async () => {
    /* Generating token with id */
    const { token , id } = await validClientTokenWithId()
    /* Making the request */
    const response = await api
      .put(`/api/clients/updateById/${id}`)
      .send({name: 123, lastName: 'client', email: 'client@update.com'})
      .set('Authorization', token)
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