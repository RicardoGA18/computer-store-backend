import Multer from 'multer'

/* Configuring multer middleware */
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})
const upload = multer.array('image')

/* Validating image with multer */
const validateImage = (req,res,next) => {
  upload(req,res, error => {
    if(error instanceof Multer.MulterError){
      console.log(error)
      if(error.message === 'File too large'){
        return res.status(406).json({
          success: false,
          content: error.toString(),
          message: 'Tamaño de imagen muy largo'
        })
      }
      return res.status(406).json({
        success: false,
        content: error.toString(),
        message: 'Imagen inválida'
      })
    } else if (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        content: error.toString(),
        message: 'Error interno al validar imagen'
      })
    }
    /* Checking that was received an image */
    if(!req.files.length){
      const error = new Error('No file received')
      console.log(error)
      return res.status(406).json({
        success: false,
        content: error.toString(),
        message: 'No se recibió ninguna imagen'
      })
    }
    /* Checking the files are images */
    for(let i = 0; i < req.files.length; i++){
      if(!(
        req.files[i].mimetype === 'image/jpeg' ||
        req.files[i].mimetype === 'image/png' ||
        req.files[i].mimetype === 'image/svg+xml' ||
        req.files[i].mimetype === 'image/gif' ||
        req.files[i].mimetype === 'image/webp'
      )){
        const customError = new Error('File type not supperted')
        console.log(customError)
        return res.status(406).json({
          success: false,
          content: customError.toString(),
          message: 'Tipo de imagen no soportado'
        })
      }
    }
    next()
    return
  })
} 

export default validateImage