import { Router } from 'express'
import * as authController from '../controllers/auth.controller'

/* Middlewares */
import validateRegistration from '../middlewares/validation/validateRegistration'

/* Routes config */
const router = Router()

router.post(
  '/sign-up',
  validateRegistration,
  authController.signUp,
)

export default router