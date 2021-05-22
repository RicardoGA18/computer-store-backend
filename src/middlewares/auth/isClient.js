import jwt from 'jsonwebtoken'
import User from '../../models/User'

const isClient = async (req,res,next) => {
  try {
    /* Verifiying that there is a token */
    const bearerToken = req.headers.authorization
    if(!bearerToken){
      const error = new Error('No token received')
      console.log(error)
      return res.status(403).json({
        success: false,
        content: error.toString(),
        message: 'No se recibió el token de acceso'
      })
    }
    /* Verifiying de expiration and if the user exists */
    const bearerArray = bearerToken.split(' ')
    const token = bearerArray[1]
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    const userObject = await User.findById(userId)
    const user = userObject.toJSON()
    if(!user){
      const error = new Error('Token with a non-existent client')
      console.log(error)
      return res.status(403).json({
        success: false,
        content: error.toString(),
        message: 'Token de acceso con cliente no existente'
      })
    }
    /* Verifiying is the same user who make the request or if is an admin */
    const { clientId } = req.params
    if(!( 
      user.role === 'admin' ||
      ( user.role === 'client' && user._id.toString() === clientId )
    )){
      const error = new Error('Unauthorized. A client only have access to his information')
      console.log(error)
      return res.status(401).json({
        success: false,
        content: error.toString(),
        message: 'Usuario no autorizado'
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
        message: 'Id inválido'
      })
    }
    if(error.message === 'jwt expired'){
      return res.status(401).json({
        success: false,
        content: error.toString(),
        message: 'Sesión expirada'
      })
    }
    if(error.message === 'jwt malformed' || error.message === 'jwt must be provided'){
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: 'Token de acceso inválido'
      })
    }
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno del servidor al validar token'
    })
  }
}

export default isClient