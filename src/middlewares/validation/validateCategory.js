import verifyKeys from '../../utils/verifyKeys'
import verifyTypes from '../../utils/verifyTypes'
import Category from '../../models/Category'

const validateCategory = async (req,res,next) => {
  /* Verifying that the req.body contains the required fields */
  const requiredFields = ['name']
  const isValidKeys = verifyKeys(req.body,requiredFields)
  if(!isValidKeys.success){
    const error = new Error(`${isValidKeys.key} is a required field`)
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: `El campo ${isValidKeys.key} es requerido`
    })
  }
  /* Destructuring fields */
  const { name } = req.body
  /* Validating the type of the fields */
  const categoryFields = ['name']
  const categoryValues = [name]
  const categoryTypes = ['string']
  const isValidTypes = verifyTypes(categoryValues,categoryTypes,categoryFields)
  if(!isValidTypes.success){
    const error = new Error(`${isValidTypes.field} must be ${isValidTypes.type}`)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: `El campo ${isValidTypes.field} debe ser ${isValidTypes.type}`
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