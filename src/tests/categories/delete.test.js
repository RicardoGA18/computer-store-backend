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

describe('/api/categories/deleteById/{categoryId}', () => {
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

  test('Delete a category successfully as an admin', async () => {
    /* Generating a valid token as an admin and a valid id */
    const token = await validAdminToken()
    const categories = await getCategoriesContent()
    const categoryId = categories[0]._id.toString()
    /* Making the request with the token */
    const response = await api
      .delete(`/api/categories/deleteById/${categoryId}`)
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    /* Verifying the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content.categoryId).toBe(categoryId)
    expect(response.body.message).toBe('Categoría elminada correctamente')
    const afterCateogories = await getCategoriesContent()
    expect(afterCateogories.length).toBe(categories.length - 1)
  })
  
  describe('Checking its using middlewres of create endpoint', () => {
    test('isAdmin middleware, making the request with an expired token', async () => {
      /* Getting an invalid token */
      const token = await invalidAdminToken()
      const categories = await getCategoriesContent()
      const categoryId = categories[0]._id
      /* Making the request with the invalid token */
      const response = await api
        .delete(`/api/categories/deleteById/${categoryId}`)
        .set('Authorization', token)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Sesión expirada')
    })
  })

  describe('Can not delete a category with an invalid id', () => {
    test('with a not mongodb is string', async () => {
      /* Generating a valid token */
      const token = await validAdminToken()
      /* Making the request with an invalid id */
      const response = await api
        .delete(`/api/categories/deleteById/asdas`)
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
        .delete(`/api/categories/deleteById/${categoryId}`)
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