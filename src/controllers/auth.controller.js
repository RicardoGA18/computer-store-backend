import User from '../models/User'
import jwt from 'jsonwebtoken'

export const signUp = async (req,res) => {
  try {
    /* Creating User */
    const newUserinstance = new User({ 
      ...req.body,
      password: User.encryptPassword(req.body.password),
    })
    const newUser = await newUserinstance.save()
    /* Generating Token */
    const token = jwt.sign({userId: newUser._id},process.env.JWT_SECRET,{
      expiresIn: 60 * 60 * 24 * 15 // 15 days
    })
    /* Removing the password */
    const userToServe = newUser.toJSON()
    delete userToServe.password
    /* Returning user with token */
    return res.status(201).json({
      success: true,
      content: { ...userToServe , token },
      message: 'Registro exitoso',
    }) 
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno del servidor al registrar usuario'
    })
  }
}

export const signIn = async (req,res) => {
  try {
    /* Verifying the user exists */
    const { email , password } = req.body
    const user = await User.findOne({ email })
    if(!user){
      const error = new Error(`There is not a user with the email ${email}`)
      console.log(error)
      return res.status(404).json({
        success: false,
        content: error.toString(),
        message: `El email ${email} no se encuentra registrado`
      })
    }
    /* Checking the password */
    if(!User.comparePassword(password,user.password)){
      const error = new Error('Inconrrect password')
      console.log(error)
      return res.status(403).json({
        success: false,
        content: error.toString(),
        message: 'Contraseña incorrecta'
      })
    }
    /* Creating the token */
    const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{
      expiresIn: 60 * 60 * 24 * 15 // 15 days
    })
    /* Removing the password */
    const userToServe = user.toJSON()
    delete userToServe.password
    /* Returning the user with the token */
    return res.status(200).json({
      success: true,
      content: {
        ...userToServe,
        token
      },
      message: 'Inicio de sesión exitoso'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno del servidor al iniciar sesión'
    })
  }
}