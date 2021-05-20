import Product from '../models/Product'

export const createProduct = async (req, res) => {
  try {
    const { categoryId , name , description , officialInformation , price , discount , stock , details  } = req.body
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
    if(!productObject){
      const error = new Error('Product not found')
      console.log(error)
      return res.status(404).json({
        success: false,
        content: error.toString(),
        message: 'Productos no encontrado',
      })
    }
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

export const updateProductById = async (req, res) => {
  try {
    const { name } = req.body
    const { productId } = req.params
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
    oldProduct.name = name
    const productObject = await oldProduct.save()
    const productToServe = productObject.to.JSON()
    return res.status(200).json({
      success: true,
      content: productToServe,
      message: "Producto actualizado correctamente"
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
    if(!productObject){
      const error = new Error('Product not found')
      console.log(error)
      return res.status(404).json({
        success: false,
        contact: error.toString(),
        message: 'Producto no encontrado'
      })
    }
    await Product.findOneAndDelete(productId)
    return res.status(200).json({
      success: true,
      content: null,
      message: 'Producto eliminado correctamente'
    })
  } catch (error) {
    console.log(error)
    if(error.path === '_id'){
      return res.status(404).json({
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

