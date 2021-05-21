import Product from '../models/Product'

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
      message: 'Últimos productos obtenidos exitosamente'
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
    await Product.findOneAndDelete(productId)
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

