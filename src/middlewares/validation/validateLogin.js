import verifyKeys from '../../utils/verifyKeys'
import verifyTypes from '../../utils/verifyTypes'
import { isEmail } from '../../utils/regexValidations'

const validateLogin = (req,res,next) => {
  /* Verifying the req.body contains the required fields */
  const requiredFields = ['email','password']
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
  /* Validating the type of the fields */
  const { email , password } = req.body
  const loginFields = ['email','password']
  const loginValues = [email,password]
  const loginTypes = ['string','string']
  const isValidTypes = verifyTypes(loginValues,loginTypes,loginFields)
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
  next()
  return
}

export default validateLogin