import Category from '../models/Category'

export const createCategory = async (req,res) => {
  try {
    const { img , name } = req.body
    const newCategoryInstance = new Category({ img , name })
    const newCategory = await newCategoryInstance.save()
    return res.status(201).json({
      success: true,
      content: newCategory,
      message: 'Categoria creada exitosamente.'
    }) 
  } catch (error) {
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: 'Error interno del servidor al crear categoria.'
    })
  }
}