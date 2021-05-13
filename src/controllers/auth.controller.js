import User from '../models/User'
import jwt from 'jsonwebtoken'

export const signUp = async (req,res) => {
  try {
    /* Creating User */
    const { name , lastName , avatar , email , password , role } = req.body
    const newUserinstance = new User({ 
      name,
      lastName,
      email,
      password: User.encryptPassword(password),
    })
    if(role){
      newUserinstance.role = role
    }
    if(avatar){
      newUserinstance.avatar = avatar
    }
    const newUser = await newUserinstance.save()
    /* Generating Token */
    const token = jwt.sign({userId: newUser._id},process.env.JWT_SECRET,{
      algorithm: 'RS256',
      expiresIn: 60 * 60 * 24 * 15 // 15 days
    })
    /* Returning user with token */
    return res.status(200).json({
      success: true,
      content: { ...newUser , token },
      message: 'Registro exitoso',
    }) 
  } catch (error) {
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno del servidor al registrar usuario'
    })
  }
}