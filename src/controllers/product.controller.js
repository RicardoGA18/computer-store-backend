import Product from '../models/Product'

export const createProduct = async (req, res) => {
  try {
    const { name , description , officialInformation , price , discount , stock , details  } = req.body
    const newProductInstance = new Product({ name , description , officialInformation , price , discount , stock , details })
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

