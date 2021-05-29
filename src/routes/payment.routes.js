import { Router } from 'express'
import * as paymentController from '../controllers/payment.controller'

/* Middlewares */
import validatePreference from '../middlewares/validation/validatePreference'
import isLogged from '../middlewares/auth/isLogged'

/* Routes config */
const router = Router()

router.post(
  '/createPreference',
  [ isLogged , validatePreference ],
  paymentController.createPreference
)

router.post(
  '/notifications',
  paymentController.getNotifications
)

export default router