import { Router } from 'express'
import * as paymentController from '../controllers/payment.controller'

/* Middlewares */
import validatePreference from '../middlewares/validation/validatePreference'
import isLogged from '../middlewares/auth/isLogged'
import isClient from '../middlewares/auth/isClient'

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

router.get(
  '/getPurchasesByUserId/:userId',
  isClient,
  paymentController.getPurchasesByUserId
)

export default router