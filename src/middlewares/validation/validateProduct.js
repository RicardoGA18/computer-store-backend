import verifykeys from '../../utils/verifyKeys'
import verifyTypes from '../../utils/verifyTypes'
import verifyDetails from '../../utils/verifyDetails'
import { isUrl } from '../../utils/regexValidations'
import Product from '../../models/Product'
import Category from '../../models/Category'

const validateProduct = async (req, res, next) => {
  /* Checking that the req.body contains the required fields */
  const requiredFields = ['categoryId','name','description','officialInformation','price','stock','details']
  const isValidKeys = verifykeys(req.body, requiredFields)
  if(!isValidKeys.success){
    const error = new Error(`${isValidKeys.key} is a required field`)
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: `El campo ${isValidKeys.key} es requerido`
    })
  }
  /* Checking the types of the fields */
  const { categoryId , name , description , officialInformation , price , discount , stock , details } = req.body
  const productFields = ['categoryId','name','description','officialInformation','discount','price','stock','details']
  const productValues = [categoryId,name,description,officialInformation,discount,price,stock,details]
  const productTypes = ['string','string','string','string','number','number','number','array']
  const isValidTypes = verifyTypes(productValues,productTypes,productFields)
  if(!isValidTypes.success){
    const error = new Error(`${isValidTypes.field} must be ${isValidTypes.type}`)
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: `El campo ${isValidTypes.field} debe ser ${isValidTypes.type}`
    })
  }
  /* Checking the format of the fields */
  if(!isUrl(officialInformation)){
    const error = new Error('The officialInformation field must be a valid url')
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: 'El campo información oficial debe ser una url válida'
    })
  }
  if(price < 0){
    const error = new Error('The price must be greater than or equal to 0')
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: 'El precio debe ser mayor o igual a 0'
    })
  }
  if(discount !== parseInt(discount)){
    const error = new Error('The discount must be an integer')
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: 'El descuento debe ser un número entero'
    })
  }
  if(!(discount >= 0 && discount <= 100)){
    const error = new Error('The discount must be in range 1-100')
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: 'El descuento debe estar en el rango 1-100'
    })
  }
  if(stock !== parseInt(stock)){
    const error = new Error('The stock must be an integer')
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: 'El stock debe ser un número entero'
    })
  }
  if(stock <= 0){
    const error = new Error('The stock must be at least 1')
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: 'El stock debe ser al menos 1'
    })
  }
  const isValidDetails = verifyDetails(details)
  if(!isValidDetails.success){
    let errorMessage , error
    if(isValidDetails.typeError === 'no received'){
      errorMessage = 'El campo details es requerido'
      error = new Error('The details field is a required field')
    }
    else if(isValidDetails.typeError === 'invalid'){
      errorMessage = 'Detalles inválidos'
      error = new Error('Invalid Details')
    }
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: errorMessage
    })
  }
  try {
    /* Checking the categoryId */
    const matchCategory = await Category.findById(categoryId)
    if(!matchCategory){
      const error = new Error('Id of non-existent category')
      console.log(error)
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: 'Id de categoría no existente'
      })
    }
    next()
    return
  } catch (error) {
    console.log(error)
    if(error.path === '_id'){
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: 'Id de categoría inválido'
      })
    }
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno al validar producto'
    })
  }
}

export default validateProduct