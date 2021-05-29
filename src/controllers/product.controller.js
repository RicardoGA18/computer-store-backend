import Product from '../models/Product'
import Category from '../models/Category'
import getUrlFromFile from '../utils/getUrlFromFile'

export const createProduct = async (req, res) => {
  try {
    const { categoryId , name , description , officialInformation , price , discount , stock , details  } = req.body
    /* Checking unique fields */
    const matchName = await Product.findOne({name})
    if(matchName){
      const error = new Error('The product already exists')
      console.log(error)
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: `El producto ${name} ya existe`
      })
    }
    /* Creating the product */
    const newProductInstance = new Product({ categoryId , name , description , officialInformation , price , stock , details })
    if(discount){
      newProductInstance.discount = discount
    }
    const newProduct = await newProductInstance.save()
    return res.status(201).json({
      success: true,
      content: newProduct.toJSON(),
      message: 'Producto creado exitosamente'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno del servidor al crear producto.'
    })
  }
}

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
    const allProducts = products.map(product => product.toJSON())
    return res.status(200).json({
      success: true,
      content: allProducts,
      message: 'Productos obtenidos exitosamente'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno al obtener productos'
    })
  }
}

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params
    const productObject = await Product.findById(productId)
    /* Checking that the product exists */
    if(!productObject){
      const error = new Error('Product not found')
      console.log(error)
      return res.status(404).json({
        success: false,
        content: error.toString(),
        message: 'Producto no encontrado',
      })
    }
    /* Returning the product */
    const product = productObject.toJSON()
    return res.status(200).json({
      success: true,
      content: product,
      message: "Producto obtenido correctamente",
    })
  } catch (error) {
    console.log(error)
    if(error.path === '_id'){
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: "Id inválido"
      })
    }
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: "Error interno al obtener producto",
    })
  }
}

export const getLatestProducts = async (req,res) => {
  try {
    const products = await Product.find({}).sort('-createdAt')
    const allProducts = products.map(product => product.toJSON())
    return res.status(200).json({
      success: true,
      content: allProducts,
      message: 'Últimos ordenados por fecha obtenidos exitosamente'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno al obtener productos'
    })
  }
}

export const getOfferProducts = async (req,res) => {
  try {
    const products = await Product.find({discount: { $gt: 0 }})
    const allProducts = products.map(product => product.toJSON())
    return res.status(200).json({
      success: true,
      content: allProducts,
      message: 'Productos en oferta obtenidos exitosamente'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno al obtener productos'
    })
  }
}

export const getProductsByCategoryId = async (req,res) => {
  try {
    const { categoryId } = req.params
    /* Checking that the category exists */
    const category = await Category.findById(categoryId)
    if(!category){
      const error = new Error('Id of non-existent category')
      console.log(error)
      return res.status(404).json({
        success: false,
        content: error.toString(),
        message: 'Id de categoría no existente'
      })
    }
    /* Getting the products */
    const products = await Product.find({ categoryId })
    const allProducts = products.map(product => product.toJSON())
    return res.status(200).json({
      success: true,
      content: allProducts,
      message: 'Productos obtenidos correctamente'
    })
  } catch (error) {
    console.log(error)
    if(error.path === '_id'){
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: "Id inválido"
      })
    }
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: "Error interno al obtener productos",
    })
  }
}

export const updateProductById = async (req,res) => {
  try {
    /* Getting the id and the product data */
    const { categoryId , name , description , officialInformation , price , discount , stock , details  } = req.body
    const { productId } = req.params
    /* Checking the product exists */
    const oldProduct = await Product.findById(productId)
    if(!oldProduct){
      const error = new Error('Product not found')
      console.log(error)
      return res.status(404).json({
        success: false,
        content: error.toString(),
        message: 'Producto no encontrado',
      })
    }
    /* Updating the product */
    oldProduct.name = name
    oldProduct.categoryId = categoryId
    oldProduct.description = description,
    oldProduct.officialInformation = officialInformation
    oldProduct.price = price
    oldProduct.stock = stock
    oldProduct.details = details
    if(discount){
      oldProduct.discount = discount
    }
    const productObject = await oldProduct.save()
    const productToServe = productObject.toJSON()
    /* Returning the updated product */
    return res.status(200).json({
      success: true,
      content: productToServe,
      message: "Producto actualizado correctamente"
    })
  } catch (error) {
    console.log(error)
    console.log('El error es en controlador')
    if(error.path === '_id'){
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: "Id inválido"
      })
    }
    return res.status(500).json({
      succes: false,
      content: error.toString(),
      message: 'Error interno al actualizar producto'
    })
  }
}

export const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params
    const productObject = await Product.findById(productId)
    /* Checking that the product exists */
    if(!productObject){
      const error = new Error('Product not found')
      console.log(error)
      return res.status(404).json({
        success: false,
        contact: error.toString(),
        message: 'Producto no encontrado'
      })
    }
    /* Deleting the product and returning the product id */
    const { _id } = productObject.toJSON()
    await Product.findByIdAndDelete(productId)
    return res.status(200).json({
      success: true,
      content: {
        productId: _id
      },
      message: 'Producto eliminado correctamente'
    })
  } catch (error) {
    console.log(error)
    if(error.path === '_id'){
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: 'Id inválido'
      })
    }
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno al eliminar producto'
    })
  }
}

export const uploadPhotoById = async (req,res) => {
  try {
    const { productId } = req.params
    const { files } = req
    const file = files[0]
    /* Checking that was received an image */
    if(!files.length){
      const error = new Error('No file received')
      console.log(error)
      return res.status(406).json({
        success: false,
        content: error.toString(),
        message: 'No se recibió ninguna imagen'
      })
    }
    /* Checking there is only one file */
    if(files.length > 1){
      const error = new Error('More than one image was received')
      console.log(error)
      return res.status(406).json({
        success: false,
        content: error.toString(),
        message: 'Se envió más de una imagen'
      })
    }
    /* Checking that the product exists */
    const oldProduct = await Product.findById(productId)
    if(!oldProduct){
      const error = new Error('Product not found')
      console.log(error)
      return res.status(404).json({
        success: false,
        content: error.toString(),
        message: 'Product no encontrado'
      })
    }
    /* Getting the category and replace it in the category */
    const url = await getUrlFromFile(file)
    oldProduct.img = url
    const productObject = await oldProduct.save()
    const productToServe = productObject.toJSON()
    return res.status(200).json({
      success: true,
      content: productToServe,
      message: 'Imagen subida exitosamente'
    })
  } catch (error) {
    console.log(error)
    if(error.path === '_id'){
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: 'Id inválido'
      })
    }
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno al subir imagen'
    })
  }
}

export const uploadSlidesById = async (req,res) => {
  try {
    /* Getting the data */
    const { files } = req
    const { imagesToDelete } = req.body
    const { productId } = req.params
    /* Checking that the product exists */
    const oldProduct = await Product.findById(productId)
    if(!oldProduct){
      const error = new Error('Product not found')
      console.log(error)
      return res.status(404).json({
        success: false,
        content: error.toString(),
        message: 'Producto no encontrado'
      })
    }
    /* Validating imageToDelete */
    const deleteArray = JSON.parse(imagesToDelete)
    if(!(deleteArray instanceof Array)){
      const error = new Error('imagesToDelete must be a stringify array')
      console.log(error)
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: 'imagesToDelete debe ser un array transformado a string'
      })
    }
    /* Getting the urls of the new slides */
    const uploadedSlides = []
    for(let file of files){
      const newUrl = await getUrlFromFile(file)
      uploadedSlides.push(newUrl)
    }
    /* Modeling slides */
    const { slides } = oldProduct.toJSON()
    let oldSlides = JSON.parse(JSON.stringify(slides))
    if(files.length){
      oldSlides = oldSlides.filter(slide => slide !== 'https://firebasestorage.googleapis.com/v0/b/computer-store-a1f8e.appspot.com/o/assets%2FGroup%203.png?alt=media&token=520fa3d8-be24-4bb1-9109-027f322d389f')
    }
    for(let url of deleteArray){
      oldSlides = oldSlides.filter(slide => slide !== url)
    }
    let newSlides = [
      ...oldSlides,
      ...uploadedSlides,
    ]
    if(!newSlides.length){
      newSlides = ['https://firebasestorage.googleapis.com/v0/b/computer-store-a1f8e.appspot.com/o/assets%2FGroup%203.png?alt=media&token=520fa3d8-be24-4bb1-9109-027f322d389f']
    }
    /* Returning the updated product */
    oldProduct.slides = newSlides
    const productObject = await oldProduct.save()
    const productToServe = productObject.toJSON()
    return res.status(200).json({
      success: true,
      content: productToServe,
      message: 'Slides subidos exitosamente'
    })
  } catch (error) {
    console.log(error)
    if(error.path === '_id'){
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: 'Id inválido'
      })
    }
    if(error instanceof SyntaxError){
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: 'Campo imagesToDelete inválido'
      })
    }
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno al subir slides'
    })
  }
}