import { Router } from 'express'
import * as clientController from '../controllers/client.controller'

/* Middlewares */
import isAdmin from '../middlewares/auth/isAdmin'
import isClient from '../middlewares/auth/isClient'
import validateUpdateClient from '../middlewares/validation/validateUpdateClient'

/* Routes config */
const router = Router()

router.get(
  '/getAll',
  isAdmin,
  clientController.getClients
)

router.get(
  '/getById/:clientId',
  isClient,
  clientController.getClientById
)

router.put(
  '/updateById/:clientId',
  [ isClient , validateUpdateClient ],
  clientController.updateClientById
)

router.delete(
  '/deleteById/:clientId',
  isClient,
  clientController.deleteClientById
)

/* Error routes */
const error = new Error('No clientId was received')

const idError = {
  success: false,
  content: error.toString(),
  message: 'No se recibió el id de cliente'
}

router.get('/getById',(req,res) => res.status(400).json(idError))
router.put('/updateById',(req,res) => res.status(400).json(idError))
router.delete('/deleteById',(req,res) => res.status(400).json(idError))
router.put('/uploadPhoto',(req,res) => res.status(400).json(idError))

export default router