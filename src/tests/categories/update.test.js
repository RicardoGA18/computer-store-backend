import Category from '../../models/Category'
import User from '../../models/User'
import { server } from '../../index'
import { connection } from 'mongoose'
import { 
  api,
  initialCategories,
  validAdminToken,
  invalidAdminToken,
  initialUsers,
  getCategoriesContent,
} from '../helpers'

describe('/api/categories/updateById/{categoryId}', () => {
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

  test('Update a category successfully as an admin', async () => {
    /* Generating a valid token as an admin and a valid id */
    const token = await validAdminToken()
    const categories = await getCategoriesContent()
    const categoryId = categories[0]._id
    /* Making the request with the token */
    const response = await api
      .put(`/api/categories/updateById/${categoryId}`)
      .send({name: 'updated category'})
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    /* Verifying the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content.name).toBe('updated category')
    expect(new Date(response.body.content.createdAt)).toStrictEqual(categories[0].createdAt)
    expect(new Date(response.body.content.updatedAt)).not.toStrictEqual(categories[0].updatedAt)
    expect(response.body.message).toBe('Categoría actualizada correctamente')
  })

  describe('Checking its using middlewres of create endpoint', () => {
    test('isAdmin middleware, making the request with an expired token', async () => {
      /* Getting an invalid token */
      const token = await invalidAdminToken()
      const categories = await getCategoriesContent()
      const categoryId = categories[0]._id
      /* Making the request with the invalid token */
      const response = await api
        .put(`/api/categories/updateById/${categoryId}`)
        .send({name: 'updated category'})
        .set('Authorization', token)
        .expect(401)
        .expect('Content-Type', /application\/json/)
  
      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Sesión expirada')
    })

    test('validateCategory middleware, making the request with an invalid name', async () => {
      /* Generating a valid token as an admin and a valid id */
      const token = await validAdminToken()
      const categories = await getCategoriesContent()
      const categoryId = categories[0]._id
      /* Making the request with an invalid name */
      const response = await api
        .put(`/api/categories/updateById/${categoryId}`)
        .send({name: 123})
        .set('Authorization', token)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('El campo name debe ser string')
    })
  })

  describe('Can not update a category with an invalid id', () => {
    test('with a not mongodb id string', async () => {
      /* Generating a valid token */
      const token = await validAdminToken()
      /* Making the request with an invalid id */
      const response = await api
        .put(`/api/categories/updateById/asddd`)
        .send({name: 'updated category'})
        .set('Authorization', token)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Id inválido')
    })

    test('with a non-existent id', async () => {
      /* Generating a valid token */
      const token = await validAdminToken()
      /* Getting the id and delete the category */
      const categories = await getCategoriesContent()
      const categoryId = categories[0]._id
      await Category.findByIdAndDelete(categoryId)
      /* Making the response */
      const response = await api
        .put(`/api/categories/updateById/${categoryId}`)
        .send({name: 'updated category'})
        .set('Authorization', token)
        .expect(404)
        .expect('Content-Type', /application\/json/)
      
      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Categoría no encontrada')
    })
  })

  afterAll(async () => {
    await connection.close()
    server.close()
  })
})