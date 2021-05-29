import * as yup from 'yup'

const onlyLettersRegex = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i

const validatePreference = async (req,res,next) => {
  try {
    const preferenceSchema = yup.object().shape({
      user: yup.object().shape({
        address: yup.string().required('Calle requerida'),
        addressNumber: yup.number().required('Número de calle requerido'),
        dni: yup.string().length(8,'DNI inválido').required('DNI requerido'),
        email: yup.string().matches(emailRegex,'Email inválido').required('Email requerido'),
        _id: yup.string().required('id requerido'),
        name: yup.string().matches(onlyLettersRegex,'Nombre inválido').required('Nombre requerido'),
        lastName: yup.string().matches(onlyLettersRegex,'Apellido inválido').required('Apellido requerido'),
        phone: yup.number().required('Número de celular inválido'),
        zipCode: yup.string().length(5,'Código postal inválido').required('Código postal requerido'),
      }).required('Usuario requerido'),
      cart: yup.array().of(yup.object().shape({
        amount: yup.number().min(1,'Cada producto debe tener una cantidad de 1 como mínimo').required('Cantidad requerida'),
        categoryId: yup.string().required('Id de categoría requerida'),
        discount: yup.number().min(0,'El descuento debe estar en el rango de 0 - 100').max(100, 'El descuento debe estar en el rango de 0 - 100'),
        _id: yup.string().required('Id de producto requerido'),
        name: yup.string().required('Nombre de producto requerido'),
        price: yup.number().min(0,'El precio debe ser mayor o igual a 0').required('Precio requerido'),
        img: yup.string().matches(urlRegex,'La url de imagen es inválida').required('La imagen de producto es requerida'),
      })).min(1,'Carrito vacío').required('Carrito requerido')
    })
    await preferenceSchema.validate(req.body)
    next()
  } catch (error) {
    let message = 'Datos inválidos'
    if (error.errors){
      message = error.errors[0]
    }
    return res.status(400).json({
      success: false,
      content: error.toString(),
      message: message,
    })
  }
}

export default validatePreference