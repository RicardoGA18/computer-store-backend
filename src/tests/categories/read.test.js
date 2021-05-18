import Category from '../../models/Category'
import { server } from '../../index'
import { connection } from 'mongoose'
import { api , initialCategories , getCategoriesContent } from '../helpers'

describe('/api/categories', () => {
  beforeEach(async () => {
    await Category.deleteMany({})
    for(let initialCategory of initialCategories){
      const initialCategoryObject = new Category(initialCategory)
      await initialCategoryObject.save()
    }
  })

  test('/getAll , Getting all categories successfully', async () => {
    /* Making the request */
    const response = await api
      .get('/api/categories/getAll')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content.length).toBe(initialCategories.length)
    expect(response.body.message).toBe('Categorías obtenidas exitosamente')
  })

  test('/getById/{categoryId} , Getting category by id successfully', async () => {
    /* Getting the id */
    const categories = await getCategoriesContent()
    const categoryId = categories[0]._id
    /* Making the request */
    const response = await api
      .get(`/api/categories/getById/${categoryId}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    /* Checking the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content.name).toBe(categories[0].name)
    expect(response.body.message).toBe('Categoría obtenida correctamente')
  })

  afterAll(async () => {
    await connection.close()
    server.close()
  })
})