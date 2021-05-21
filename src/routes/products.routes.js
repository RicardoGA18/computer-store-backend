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

router.get(
  '/getAll',
  productController.getProducts
)

router.get(
  '/getById/:productId',
  productController.getProductById
)

router.get(
  '/getLatest',
  productController.getLatestProducts
)

router.get(
  '/getOffers',
  productController.getOfferProducts
)

router.put(
  '/updateById/:productId',
  [ isAdmin , validateProduct ],
  productController.updateProductById
)

router.delete(
  '/deleteById/:productId',
  isAdmin,
  productController.deleteProductById
)

/* Error routes */
const error = new Error('No productId was received')

const idError = {
  success: false,
  content: error.toString(),
  message: 'No se recibió el id de producto'
}

router.get('/getById',(req,res) => res.status(400).json(idError))
router.put('/updateById',(req,res) => res.status(400).json(idError))
router.delete('/deleteById',(req,res) => res.status(400).json(idError))

export default router