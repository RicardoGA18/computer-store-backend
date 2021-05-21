import Product from '../../models/Product'
import Category from '../../models/Category'
import User from '../../models/User'
import { server } from '../../index'
import { connection } from 'mongoose'
import {
  api,
  initialCategories,
  initialUsers,
  validAdminToken,
  invalidAdminToken,
  initialProducts,
  productExample,
  getCategoriesContent,
  getProductsContent,
  invalidKeyValueProduct,
} from '../helpers'

describe('/api/products/deleteById/{productId}', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Category.deleteMany({})
    await Product.deleteMany({})
    for(let initialCategory of initialCategories){
      const initialCategoryObject = new Category(initialCategory)
      await initialCategoryObject.save()
    }
    for(let initialUser of initialUsers){
      const initialUserObject = new User(initialUser)
      await initialUserObject.save()
    }
    /* Verify there is two categories at least */
    const categories = await getCategoriesContent()
    let i = 0
    for(let initialProduct of initialProducts){
      if(i % 2 === 0){
        initialProduct.categoryId = categories[0]._id
      }else{
        initialProduct.categoryId = categories[1]._id
      }
      i++
      const intialProductObject = new Product(initialProduct)
      await intialProductObject.save()
    }
  })

  test('Delete a product successfully as an admin', async () => {
    /* Generating a valid token as an admin and a valid id */
    const token = await validAdminToken()
    const products = await getProductsContent()
    const productId = products[0]._id.toString()
    /* Making the request with the token */
    const response = await api
      .delete(`/api/products/deleteById/${productId}`)
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content.productId).toBe(productId)
    expect(response.body.message).toBe('Producto eliminado correctamente')
  })

  test('Checking its using isAdmin middleware', async () => {
    /* Getting an invalid token */
    const token = await invalidAdminToken()
    const products = await getProductsContent()
    const productId = products[0]._id.toString()
    /* Making the request with the invalid token */
    const response = await api
      .delete(`/api/products/deleteById/${productId}`)
      .set('Authorization', token)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeFalsy()
    expect(response.body.message).toBe('Sesión expirada')
  })

  describe('Can not delete a product with an invalid id', () => {
    test('with a not mongodb id string', async () => {
      /* Getting an invalid token */
      const token = await validAdminToken()
      /* Making the request with the invalid token */
      const response = await api
        .delete(`/api/products/deleteById/asdasd`)
        .set('Authorization', token)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Id inválido')
    })

    test('with a non-existent id', async () => {
      /* Getting an invalid token an invalid id */
      const token = await validAdminToken()
      const categories = await getCategoriesContent()
      const invalidId = categories[0]._id
      /* Making the request with the invalid token */
      const response = await api
        .delete(`/api/products/deleteById/${invalidId}`)
        .set('Authorization', token)
        .expect(404)
        .expect('Content-Type', /application\/json/)
      
      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Producto no encontrado')
    })
  })

  afterAll(async () => {
    await connection.close()
    server.close()
  })
})