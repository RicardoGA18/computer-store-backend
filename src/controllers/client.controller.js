import User from '../models/User'
import getUrlFromFile from '../utils/getUrlFromFile'

export const getClients = async (req, res) => {
	try {
		const clients = await User.find({role: 'client'},{password: 0})
		const allClients = clients.map(client => client.toJSON())
		return res.status(200).json({
			success: true,
			content: allClients,
			message: 'Clientes obtenidos exitosamente'
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			success: false,
			content: error.toString(),
			message: 'Error interno al obtener clientes'
		})
	}
}

export const getClientById = async (req, res) => {
	try {
		const { clientId } = req.params
		const clientObject = await User.findById(clientId,{password: 0})
		if(!clientObject){
			const error = new Error('Client not found')
			console.log(error)
			return res.status(404).json({
				success: false,
				content: error.toString(),
				message: 'Cliente no encontrado'
			})
		}
		const client = clientObject.toJSON()
		return res.status(200).json({
			success: true,
			content: client,
			message: 'Cliente obtenido correctamente'
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

export const updateClientById = async (req, res) => {
	try {
		const { name , lastName , email } = req.body
		const { clientId } = req.params
		const oldClient = await User.findById(clientId)
		if(!oldClient){
			const error = new Error('Client not found')
			console.log(error)
			return res.status(404).json({
				success: false,
				content: error.toString(),
				message: 'Cliente no encontrado'
			})
		}
		oldClient.name = name
		oldClient.lastName = lastName
		oldClient.email = email
		const clientObject = await oldClient.save()
		const clientToServe = clientObject.toJSON()
		delete clientToServe.password
		return res.status(200).json({
			success: true,
			content: clientToServe,
			message: 'Cliente actualizado correctamente'
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
			message: 'Error interno al actualizar cliente'
		})
	}
}

export const deleteClientById = async (req, res) => {
	try {
		const { clientId } = req.params
		/* Checking that the client exists */
		const client = await User.findById(clientId)
		if(!client){
			const error = new Error('Client not found')
			console.log(error)
			return res.status(404).json({
				success: false,
				content: error.toString(),
				message: 'Cliente no encontrado'
			})
		}
		/* Deleting the client */
		await User.findByIdAndDelete(clientId)
		return res.status(200).json({
			success: true,
			content: {
				clientId: client.toJSON()._id,
			},
			message: 'Cliente eliminado correctamente'
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
			message: 'Error interno al eliminar cliente'
		})
	}
}

export const uploadAvatarById = async (req,res) => {
	try {
		const { clientId } = req.params
		const { files } = req
		const file = files[0]
		/* Checking that was received an image */
		if(!files.length){
			const error = new Error('No file received')
			console.log(error)
			return res.status(406).json({
				success: false,
				content: error.toString(),
				message: 'No se recibió ninguna imagen'
			})
		}
		/* Checking there is only one file */
		if(files.length > 1){
			const error = new Error('More than one image was received')
			console.log(error)
			return res.status(406).json({
				success: false,
				content: error.toString(),
				message: 'Se envió más de una imagen'
			})
		}
		/* Checking that the client exists */
		const oldClient = await User.findById(clientId)
		if(!oldClient){
			const error = new Error('Client not found')
			console.log(error)
			return res.status(404).json({
				success: false,
				content: error.toString(),
				message: 'Cliente no encontrado'
			})
		}
		/* Getting the url and replace it in the client */
		const url = await getUrlFromFile(file)
		oldClient.avatar = url
		const clientObject = await oldClient.save()
		const clientToServe = clientObject.toJSON()
		return res.status(200).json({
			success: true,
			content: clientToServe,
			message: 'Avatar subido correctamente'
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
			message: 'Error interno al subir avatar'
		})
	}
}