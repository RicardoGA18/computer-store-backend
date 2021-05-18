import Category from '../models/Category'

export const createCategory = async (req,res) => {
  try {
    const { name } = req.body
    const newCategoryInstance = new Category({ name })
    const newCategory = await newCategoryInstance.save()
    const category = newCategory.toJSON()
    return res.status(201).json({
      success: true,
      content: category,
      message: 'Categoria creada exitosamente.'
    }) 
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno del servidor al crear categoría'
    })
  }
}

export const getCategories = async (req,res) => {
  try {
    const categories = await Category.find({})
    const allCategories = categories.map(category => category.toJSON())
    return res.status(200).json({
      success: true,
      content: allCategories,
      message: 'Categorías obtenidas exitosamente'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno al obtener categorías'
    })
  }
}

export const getCategoryById = async (req,res) => {
  try {
    const { categoryId } = req.params
    const categoryObject = await Category.findById(categoryId)
    /* Checking that the category exists */
    if(!categoryObject){
      const error = new Error('Category not found')
      console.log(error)
      return res.status(404).json({
        success: false,
        content: error.toString(),
        message: 'Categoría no encontrada'
      })
    }
    /* returning the category */
    const category = categoryObject.toJSON()
    return res.status(200).json({
      success: true,
      content: category,
      message: "Categoría obtenida correctamente"
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno al obtener categoría'
    })
  }
}