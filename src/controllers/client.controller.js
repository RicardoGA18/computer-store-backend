import User from '../models/User'

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
		const client = clientObject.toJSON()
		return res.status(200).json({
			success: true,
			content: client,
			message: 'Cliente obtenido correctamente'
		})
	} catch (error) {
		console.log(error)
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
		await User.findByIdAndDelete(clientId)
		return res.status(200).json({
			success: true,
			content: {
				clientId: clientId,
			},
			message: 'Cliente eliminado correctamente'
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			success: false,
			content: error.toString(),
			message: 'Error interno al eliminar cliente'
		})
	}
}