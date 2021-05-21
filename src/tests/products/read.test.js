import Product from '../../models/Product'
import Category from '../../models/Category'
import { server } from '../../index'
import { connection } from 'mongoose'
import {
  api,
  initialProducts,
  initialCategories,
  getProductsContent,
  getCategoriesContent
} from '../helpers'

describe('Get products => /api/products', () => {
  beforeEach(async () => {
    await Product.deleteMany({})
    await Category.deleteMany({})
    for(let initialCategory of initialCategories){
      const initialCategoryObject = new Category(initialCategory)
      await initialCategoryObject.save()
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

  test('/getAll , Getting all products successfully', async () => {
    /* Making the request */
    const response = await api
      .get('/api/products/getAll')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content.length).toBe(initialProducts.length)
    expect(response.body.message).toBe('Productos obtenidos exitosamente')
  })

  describe('/getById/{productId}', () => {
    test('Getting product by id successfully', async () => {
      /* Getting the id */
      const products = await getProductsContent()
      const productId = products[0]._id
      /* Making the request */
      const response = await api
        .get(`/api/products/getById/${productId}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeTruthy()
      expect(response.body.content.name).toBe(products[0].name)
      expect(response.body.message).toBe('Producto obtenido correctamente')
    })

    describe('Can not get a product with an invalid id', () => {
      test('with a not mongodb id string', async () => {
        /* Making the request with an invalid id */
        const response = await api
          .get('/api/products/getById/asdasd')
          .expect(400)
          .expect('Content-Type', /application\/json/)

        /* Checking the response */
        expect(response.body.success).toBeFalsy()
        expect(response.body.message).toBe('Id inválido')
      })

      test('with a non-existent id', async () => {
        /* Getting an invalid id */
        const categories = await getCategoriesContent()
        const invalidId = categories[0]._id
        /* Making the request */
        const response = await api
          .get(`/api/products/getById/${invalidId}`)
          .expect(404)
          .expect('Content-Type', /application\/json/)

        /* Checking the response */
        expect(response.body.success).toBeFalsy()
        expect(response.body.message).toBe('Producto no encontrado')
      })
    })
  })

  describe('/getByCategoryId/{categoryId}', () => {
    test('Getting products by category id successfully', async () => {
      /* Getting the id */
      const categories = await getCategoriesContent()
      const categoryId = categories[0]._id.toString()
      /* Making the request */
      const response = await api
        .get(`/api/products/getByCategoryId/${categoryId}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      /* Checking the response */
      expect(response.body.success).toBeTruthy()
      expect(response.body.message).toBe('Productos obtenidos correctamente')
      for(let product of response.body.content){
        expect(product.categoryId).toBe(categoryId)
      }
    })

    describe('Can not get a product with an invalid category id', () => {
      test('with a not mongodb id string', async () => {
        /* Making the request with an invalid id */
        const response = await api
          .get('/api/products/getByCategoryId/asdasd')
          .expect(400)
          .expect('Content-Type', /application\/json/)
        
        /* Checking the response */
        expect(response.body.success).toBeFalsy()
        expect(response.body.message).toBe('Id inválido')
      })

      test('with a non-existent category id', async () => {
        /* Getting an invalid id */
        const products = await getProductsContent()
        const invalidId = products[0]._id
        /* Making the request */
        const response = await api
          .get(`/api/products/getByCategoryId/${invalidId}`)
          .expect(404)
          .expect('Content-Type', /application\/json/)

        /* Checking the response */
        expect(response.body.success).toBeFalsy()
        expect(response.body.message).toBe('Id de categoría no existente')
      })
    })
  })

  test('/getLatest , Getting latest products successfully', async () => {
    /* Making the request */
    const response = await api
      .get('/api/products/getLatest')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.message).toBe('Últimos ordenados por fecha obtenidos exitosamente')
    for(let i = 0; i < response.body.content.length - 1; i++){
      const firstDate = new Date(response.body.content[i].createdAt)
      const secondDate = new Date(response.body.content[i+1].createdAt)
      expect(firstDate.getTime()).toBeGreaterThanOrEqual(secondDate.getTime())
    }
  })

  test('/getOffers , Getting offer products successfully', async () => {
    /* Making the request */
    const response = await api
      .get('/api/products/getOffers')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.message).toBe('Productos en oferta obtenidos exitosamente')
    for(let product of response.body.content){
      expect(product.discount).toBeGreaterThan(0)
    }
  })

  afterAll(async () => {
    await connection.close()
    server.close()
  })
})