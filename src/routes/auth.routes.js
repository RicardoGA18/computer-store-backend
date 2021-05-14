import { Router } from 'express'
import * as authController from '../controllers/auth.controller'

/* Middlewares */
import validateRegistration from '../middlewares/validation/validateRegistration'
import validateLogin from '../middlewares/validation/validateLogin'

/* Routes config */
const router = Router()

router.post(
  '/sign-up',
  validateRegistration,
  authController.signUp,
)

router.post(
  '/sign-in',
  validateLogin,
  authController.signIn,
)

export default router