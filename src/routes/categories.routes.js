import { Router } from 'express'
import * as categoryController from '../controllers/category.controller'

/* Middlewares */
import validateCategory from '../middlewares/validation/validateCategory'
import isAdmin from '../middlewares/auth/isAdmin'

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

export default router