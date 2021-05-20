// getUsers => Obtener todos los usuarios
// getUserById => Obtener un usuario por su id
// updateUserById => Actualizar usuario por su id
// deleteUserById => Eliminar usuario por su id
import User from '../models/User'

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
        const allUsers = users.map(user => user.toJSON())
        return res.status(200).json({
            success: true,
            content: allUsers,
            message: 'Usuarioas obtenidos exitosamente'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            content: error.toString(),
            message: 'Error interno al obtener usuarios'
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params
        const userObject = await User.findById(userId)
        if(!userObject){
            const error = new Error('User not found')
            console.log(error)
            return res.status(404).json({
                success: false,
                content: error.toString(),
                message: 'Usuarios no encontrados'
            })
        }
        const user = userObject.toJSON()
        return res.status(200).json({
            success: true,
            content: user,
            message: 'Usuario obtenido correctamente'
        })
    } catch (error) {
        console.log(error)
        if(error.path === '_id'){
            return res.status(400).json({
                success: false,
                content: error.toString(),
                message: 'Id inválido'
            })
        }
        return res.status(500).json({
            success: false,
            content: error.toString(),
            message: 'Error interno al obtener usario'
        })
    }
}

export const updateUserById = async (req, res) => {
    try {
        const { name } = req.body
        const { userId } = req.params
        const oldUser = await User.findById(userId)
        if(!oldUser){
            const error = new Error('User not found')
            console.log(error)
            return res.status(404).json({
                success: false,
                content: error.toString(),
                message: 'User no encontrado'
            })
        }
        oldUser.name = name
        const userObject = await oldUser.save()
        const userToServe = userObject.to.JSON()
        return res.status(200).json({
            success: true,
            content: userToServe,
            message: 'Usuario actualizado correctamente'
        })
    } catch (error) {
        console.log(error)
        if(error.path === '_id'){
            return res.status(400).json({
                success: false,
                content: error.toString(),
                message: 'Id inválido'
            })
        }
        return res.status(500).json({
            success: flase,
            content: error.toString(),
            message: 'Error interno al actualizar producto'
        })
    }
}

export const deleteUserById = async (req, res) => {
    try {
        const { userId } = req.params
        const userObject = await User.findById(userId)
        if(!userObject){
            const error = new Error('User not found')
            console.log(error)
            return res.status(404).json({
                success: false,
                content: error.toString(),
                message: 'Usuario no encontrado'
            })
        }
        await User.findByIdAndDelete(userId)
        return res.status(200).json({
            success: true,
            content: null,
            message: 'Usuario eliminado correctamente'
        })
    } catch (error) {
        console.log(error)
        if(error.path === '_id'){
            return res.status(404).json({
                success: false,
                content: error.toString(),
                message: 'Id inválido'
            })
        }
        return res.status(500).json({
            success: false,
            content: error.toString(),
            message: 'Error interno al eliminar usuario'
        })
    }
}