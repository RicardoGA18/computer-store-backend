import verifykeys from '../../utils/verifyKeys'
import verifyTypes from '../../utils/verifyTypes'
import { isUrl } from '../../utils/regexValidations'
import Product from '../../models/Product'

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
  const { categoryId, name, description , officialInformation , price , discount , stock , details } = req.body
  const productFields = ['categoryId','name','description','officialInformation','discount','price','stock','details']
  const productValues = [categoryId,name,description,officialInformation,discount,price,stock,details]
  const productTypes = ['integer','string','string','string','number','number','number','object']
  const isValidTypes = verifyTypes(productValues,productTypes,productFields)
  if(!isValidTypes.success){
    const error = new Error(`${isValidTypes.field} must be ${isValidTypes.type}`)
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
  /* Checking unique fields */
  try {
    
  } catch (error) {
    
  }
}

export default validateProduct