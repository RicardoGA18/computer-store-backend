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

describe('/api/products/create', () => {
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

  test('Create a product successfully as an admin', async () => {
    /* Generating a valid token as an admin and getting the categoryId */
    const token = await validAdminToken()
    const categories = await getCategoriesContent()
    /* Making the response with the valid token and categoryId */
    const response = await api
      .post('/api/products/create')
      .send({ ...JSON.parse(JSON.stringify(productExample)) , categoryId: categories[0]._id })
      .set('Authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    /* Checking the response */
    expect(response.body.success).toBeTruthy()
    expect(response.body.content.categoryId).toBe(categories[0]._id.toString())
    expect(response.body.message).toBe('Producto creado exitosamente')
  })

  test('Checking its using the isAdmin middleware', async () => {
    /* Making the request an expired token */
    const token = await invalidAdminToken()
    const categories = await getCategoriesContent()
    const response = await api
      .post('/api/products/create')
      .send({ ...JSON.parse(JSON.stringify(productExample)) , categoryId: categories[0]._id })
      .set('Authorization', token)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    
    /* checking the response */
    expect(response.body.success).toBeFalsy()
    expect(response.body.message).toBe('Sesión expirada')
  })

  describe('Product can not be added with an invalid request body', () => {
    test('with an existent name', async () => {
      /* Getting the token and an invalid id and preparing the product */
      const products = await getProductsContent()
      const token = await validAdminToken()
      const categories = await getCategoriesContent()
      const existentProduct = {
        ...JSON.parse(JSON.stringify(productExample)),
        categoryId: categories[0]._id,
        name: products[0].name,
      }
      /* Making the response */
      const response = await api
        .post('/api/products/create')
        .send(existentProduct)
        .set('Authorization', token)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      /* Checking the response */
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toBe(`El producto ${products[0].name} ya existe`)
    })

    test('without a required field', async () => {
      /* Required fields */
      const requiredFields = ['name','categoryId','description','officialInformation','price','stock','details']
      for(let field of requiredFields){
        /* Getting a product object without the field */
        const incompleteProduct = { ...JSON.parse(JSON.stringify(productExample)), }
        delete incompleteProduct[field]
        /* Getting the token and the categoryId */
        const token = await validAdminToken()
        const categories = await getCategoriesContent()
        /* Making the request */
        if(field !== 'categoryId'){
          incompleteProduct.categoryId = categories[0]._id
        }
        const response = await api
          .post('/api/products/create')
          .send(incompleteProduct)
          .set('Authorization', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        /* Checking the response */
        expect(response.body.success).toBeFalsy()
        expect(response.body.message).toMatch(`El campo ${field} es requerido`)
      }
    })

    test('with an invalid field', async () => {
      /* Getting the token and the categoryId */
      const token = await validAdminToken()
      const categories = await getCategoriesContent()
      for(let keyValue of invalidKeyValueProduct){
        /* Preparing the example */
        const invalidProduct = {
          ...JSON.parse(JSON.stringify(productExample)),
          categoryId: categories[0]._id,
          [keyValue.key]: keyValue.value
        }
        /* Making the request with the invalid product */
        const response = await api
          .post('/api/products/create')
          .send(invalidProduct)
          .set('Authorization', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)
        
        /* Checking the response */
        expect(response.body.success).toBeFalsy()
        expect(response.body.message).toBe(keyValue.message)
      }
    })

    describe('with invalid subdocument details', () => {
      test('with an empty details array', async () => {
        /* Getting the token and the categoryId */
        const token = await validAdminToken()
        const categories = await getCategoriesContent()
        /* Preparing the example */
        const invalidProduct = {
          ...JSON.parse(JSON.stringify(productExample)),
          categoryId: categories[0]._id,
          details: []
        }
        /* Making the request with the invalid product */
        const response = await api
          .post('/api/products/create')
          .send(invalidProduct)
          .set('Authorization', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)
        
        /* Checking the response */
        expect(response.body.success).toBeFalsy()
        expect(response.body.message).toBe('El campo details es requerido')
      })

      test('without a required field', async () => {
        /* Getting the token and the categoryId */
        const token = await validAdminToken()
        const categories = await getCategoriesContent()
        const fields = ['key','value']
        for(let field of fields){
          /* Preparing the example */
          const invalidProduct = {
            ...JSON.parse(JSON.stringify(productExample)),
            categoryId: categories[0]._id,
          }
          delete invalidProduct.details[0][field]
          /* Making the request with the invalid product */
          const response = await api
            .post('/api/products/create')
            .send(invalidProduct)
            .set('Authorization', token)
            .expect(400)
            .expect('Content-Type', /application\/json/)
          
          /* Checking the response */
          expect(response.body.success).toBeFalsy()
          expect(response.body.message).toBe('Detalles inválidos')
        }
      })

      test('with an invalid field', async () => {
        /* Getting the token and the categoryId */
        const token = await validAdminToken()
        const categories = await getCategoriesContent()
        const fields = ['key','value']
        for(let field of fields){
          /* Preparing the example */
          const invalidProduct = {
            ...JSON.parse(JSON.stringify(productExample)),
            categoryId: categories[0]._id,
          }
          invalidProduct.details[0][field] = 124
          /* Making the request with the invalid product */
          const response = await api
            .post('/api/products/create')
            .send(invalidProduct)
            .set('Authorization', token)
            .expect(400)
            .expect('Content-Type', /application\/json/)
          
          /* Checking the response */
          expect(response.body.success).toBeFalsy()
          expect(response.body.message).toBe('Detalles inválidos')
        }
      })
    })
    describe('with an invalid categoryId', () => {
      test('with a no categoryId string', async () => {
        /* Getting the token and preparing the product */
        const token = await validAdminToken()
        const invalidProduct = {
          ...JSON.parse(JSON.stringify(productExample)),
          categoryId: 'asd',
        }
        /* Making the request with the invalid product */
        const response = await api
          .post('/api/products/create')
          .send(invalidProduct)
          .set('Authorization', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)
        
        /* Checking the response */
        expect(response.body.success).toBeFalsy()
        expect(response.body.message).toBe('Id de categoría inválido')
      })

      test('with a non-existent categoryId', async () => {
        /* Getting the token and an invalid id and preparing the product */
        const products = await getProductsContent()
        const token = await validAdminToken()
        const invalidProduct = {
          ...JSON.parse(JSON.stringify(productExample)),
          categoryId: products[0]._id,
        }
        /* Making the request with the invalid product */
        const response = await api
          .post('/api/products/create')
          .send(invalidProduct)
          .set('Authorization', token)
          .expect(400)
          .expect('Content-Type', /application\/json/)
        
        /* Checking the response */
        expect(response.body.success).toBeFalsy()
        expect(response.body.message).toBe('Id de categoría no existente')
      })
    })
  })

  afterAll(async () => {
    await connection.close()
    server.close()
  })
})