import jwt from 'jsonwebtoken'
import User from '../../models/User'

const isAdmin = async (req,res,next) => {
  try {
    /* Verifiying that there is a token */
    const token = req.headers['x-access-token']
    if(!token){
      const error = new Error('No token received')
      console.log(error)
      return res.status(403).json({
        success: false,
        content: error.toString(),
        message: 'No se recibió el token de acceso'
      })
    }
    /* Verifiying de expiration and if the user exists */
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    const userObject = await User.findById(userId)
    const user = userObject.toJSON()
    if(!user){
      const error = new Error('Token with a non-existent user')
      console.log(error)
      return res.status(403).json({
        success: false,
        content: error.toString(),
        message: 'Token de acceso con usuario no existente'
      })
    }
    /* Verifiyin the user have the admin role */
    if(user.role !== 'admin'){
      const error = new Error('Unauthorized. The user must be an admin')
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
    if(error.message === 'jwt expired'){
      return res.status(401).json({
        success: false,
        content: error.toString(),
        message: 'Sesión expirada'
      })
    }
    if(error.message === 'jwt malformed'){
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

export default isAdmin