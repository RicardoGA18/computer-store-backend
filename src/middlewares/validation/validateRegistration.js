import verifyKeys from '../../utils/verifyKeys'
import verifyTypes from '../../utils/verifyTypes'
import { isOnlyLetters , isEmail } from '../../utils/regexValidations'
import User from '../../models/User'

const validateRegistration = async (req,res,next) => {
  /* Verifying that the req.body contains the required fields */
  const requiredFields = ['name','lastName','email','password']
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
  const { name , lastName , email , password } = req.body
  /* Validating the type of the fields */
  const registrationFields = ['name','lastName','email','password']
  const registrationValues = [name,lastName,email,password]
  const registrationTypes = ['string','string','string','string']
  const isValidTypes = verifyTypes(registrationValues,registrationTypes,registrationFields)
  if(!isValidTypes.success){
    const error = new Error(`${isValidTypes.field} must be ${isValidTypes.type}`)
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: `El campo ${isValidTypes.field} debe ser ${isValidTypes.type}`
    })
  }
  /* Validating the format of the fields */
  if(!isOnlyLetters(name)){
    const error = new Error('The name field is invalid')
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: 'El nombre es inválido'
    })
  }
  if(!isOnlyLetters(lastName)){
    const error = new Error('The lastName field is invalid')
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: 'El apellido es inválido'
    })
  }
  if(!isEmail(email)){
    const error = new Error('The email field is invalid')
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: 'El email es inválido'
    })
  }
  if(password.length < 6){
    const error = new Error('The password must be at least 6 characters long')
    console.log(error)
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: 'La contraseña debe tener 6 caracteres como mínimo'
    })
  }
  /* Validating unique fields */
  try {
    const matchEmail = await User.findOne({email})
    if(matchEmail){
      const error = new Error(`${email} email already exists. The email must be unique`)
      console.log(error)
      return res.status(409).json({
        success: false,
        content: error.toString(),
        message: `El email ${email} ya existe`
      })
    }
    next()
    return
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno del servidor al validar registro de usuario'
    })
  }
}

export default validateRegistration