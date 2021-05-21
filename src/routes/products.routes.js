import { Router } from 'express'
import * as productController from '../controllers/product.controller' 

/* Middlewares */
import validateProduct from '../middlewares/validation/validateProduct'
import isAdmin from '../middlewares/auth/isAdmin'
import validateImage from '../middlewares/validation/validateImage'

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
  '/getByCategoryId/:categoryId',
  productController.getProductsByCategoryId
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

router.put(
  '/uploadPhoto/:productId',
  [ isAdmin , validateImage ],
  productController.uploadPhotoById
)

router.put(
  '/uploadSlides/:productId',
  [ isAdmin , validateImage ],
  productController.uploadSlidesById
)

/* Error routes */
const error = new Error('No productId was received')
const categoryIdError = new Error('No categoryId was received')

const idError = {
  success: false,
  content: error.toString(),
  message: 'No se recibió el id de producto'
}

router.get('/getById',(req,res) => res.status(400).json(idError))
router.get('/getByCategoryId',(req,res) => {
  return res.status(400).json({
    success: false,
    content: categoryIdError,
    message: 'No se recibió el id de categoría'
  })
})
router.put('/updateById',(req,res) => res.status(400).json(idError))
router.delete('/deleteById',(req,res) => res.status(400).json(idError))
router.put('/uploadPhoto',(req,res) => res.status(400).json(idError))
router.put('/uploadSlides',(req,res) => res.status(400).json(idError))

export default router