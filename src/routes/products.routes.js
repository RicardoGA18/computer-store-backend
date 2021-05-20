import { Router } from 'express'
import * as productController from '../controllers/product.controller' 

/* Middlewares */
import validateProduct from '../middlewares/validation/validateProduct'
import isAdmin from '../middlewares/auth/isAdmin'

/* Routes config */
const router = Router()

router.post(
  '/create',
  [ isAdmin , validateProduct ],
  productController.createProduct
)

export default router