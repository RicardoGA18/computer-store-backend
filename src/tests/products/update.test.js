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
  getCategoriesContent,
  getProductsContent,
} from '../helpers'

describe('/api/products/updateById/{productId}', () => {
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

  test('Update a product successfully as an admin', async () => {
    /* Generating a valid token as an admin and a valid id */
    const token = await validAdminToken()
    const products = await getProductsContent()
    const productId = products[0]._id
    /* Making the request with the token */
    const response = await api
      .put(`/api/products/updateById/${productId}`)
      .send({ ...JSON.parse(JSON.stringify(products[0])) , name: 'Nombre actualizado' })
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content._id).toBe(productId.toString())
    expect(response.body.content.name).toBe('Nombre actualizado')
    expect(response.body.message).toBe('Producto actualizado correctamente')
  })

  describe('Checking its using tested middlewares', () => {
    test('isAdmin middleware', async () => {
      /* Making the request with an expired token */
      const token = await invalidAdminToken()
      const products = await getProductsContent()
      const productId = products[0]._id
      const response = await api
        .put(`/api/products/updateById/${productId}`)
        .send({ ...JSON.parse(JSON.stringify(products[0])) , name: 'Nombre actualizado' })
        .set('Authorization', token)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      
      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Sesión expirada')
    })

    test('validateProduct middleware', async () => {
      /* Making the request with an invalid name */
      const token = await validAdminToken()
      const products = await getProductsContent()
      const productId = products[0]._id
      const response = await api
        .put(`/api/products/updateById/${productId}`)
        .send({ ...JSON.parse(JSON.stringify(products[0])) , name: 123 })
        .set('Authorization', token)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('El campo name debe ser string')
    })
  })

  describe('Product can not be added with an invalid id', () => {
    test('with a no productId string', async () => {
      /* Getting the token */
      const token = await validAdminToken()
      const products = await getProductsContent()
      /* Making the request with an invalid id */
      const response = await api
        .put(`/api/products/updateById/asdas`)
        .send({ ...JSON.parse(JSON.stringify(products[0])) })
        .set('Authorization', token)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe('Id inválido')
    })

    test('with a non-existent productId', async () => {
      /* Getting the token and an invalid id */
      const token = await validAdminToken()
      const products = await getProductsContent()
      const categories = await getCategoriesContent()
      const response = await api
        .put(`/api/products/updateById/${categories[0]._id}`)
        .send({ ...JSON.parse(JSON.stringify(products[0])) })
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