import { Router } from 'express'
import * as categoryController from '../controllers/category.controller'

/* Middlewares */
import validateCategory from '../middlewares/validation/validateCategory'
import isAdmin from '../middlewares/auth/isAdmin'
import validateImage from '../middlewares/validation/validateImage'

/* Routes config */
const router = Router()

router.post(
  '/create',
  [ isAdmin , validateCategory ],
  categoryController.createCategory,
)

router.get(
  '/getAll',
  categoryController.getCategories
)

router.get(
  '/getById/:categoryId',
  categoryController.getCategoryById
)

router.put(
  '/updateById/:categoryId',
  [ isAdmin , validateCategory ],
  categoryController.updateCategoryById
)

router.delete(
  '/deleteById/:categoryId',
  isAdmin,
  categoryController.deleteCategoryById
)

router.put(
  '/uploadPhoto/:categoryId',
  [ isAdmin , validateImage ],
  categoryController.uploadPhotoById
)

/* Error routes */
const error = new Error('No categoryId was received')

const idError = {
  success: false,
  content: error.toString(),
  message: 'No se recibió el id de categoría'
}

router.get('/getById',(req,res) => res.status(400).json(idError))
router.put('/updateById',(req,res) => res.status(400).json(idError))
router.delete('/deleteById',(req,res) => res.status(400).json(idError))
router.put('/uploadPhoto',(req,res) => res.status(400).json(idError))

export default router