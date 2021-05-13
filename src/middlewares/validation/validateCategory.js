import verifyKeys from '../../utils/verifyKeys'
import verifyTypes from '../../utils/verifyTypes'
import { isUrl } from '../../utils/regexValidations'
import Category from '../../models/Category'

const validateCategory = async (req,res,next) => {
  /* Verifying that the req.body contains the required fields */
  const requiredFields = ['img','name']
  const isValidKeys = verifyKeys(req.body,requiredFields)
  if(!isValidKeys.success){
    const error = new Error(`${isValidKeys.key} is a required field`)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: `El campo ${isValidKeys.key} es requerido`
    })
  }
  /* Destructuring fields */
  const { name , img } = req.body
  /* Validating the type of the fields */
  const categoryFields = [name,img]
  const categoryTypes = ['string','string']
  const isValidTypes = verifyTypes(categoryFields,categoryTypes)
  if(!isValidTypes.success){
    const error = new Error(`${isValidTypes.field} must be ${isValidTypes.type}`)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: `El campo ${isValidTypes.field} debe ser ${isValidTypes.type}`
    })
  }
  /* Validating the format of the fields */
  if(!isUrl(img)){
    const error = new Error('The img field is an invalid url')
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: 'La URL de la imagen es inválida'
    })
  }
  /* Validating unique fields */
  try {
    const matchName = await Category.findOne({name})
    if(matchName){
      const error = new Error(`'${name}' category already exists. The name field must be unique`)
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: `La categoría ${name} ya existe`
      })
    }
    next()
    return
  } catch (error) {
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno del servidor al validar categoría'
    }) 
  }
}

export default validateCategory