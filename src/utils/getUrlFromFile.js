import { Storage } from '@google-cloud/storage'
import { v4 as uuid } from 'uuid'
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

/* Configure the Storage with the firebase credentials */
const firebaseCredentials = process.env.FIREBASE_CREDENTIALS_JSON
const storage = new Storage({
  projectId: "computer-store-a1f8e",
  credentials: JSON.parse(firebaseCredentials)
})

/* Create the bucket */
const bucket = storage.bucket('computer-store-a1f8e.appspot.com')

const getUrlFromFile = async (file) => {
  return new Promise((resolve,reject) => {
    /* Checking that the file exists */
    if(!file){
      const error = new Error('A file was not received')
      return reject(error)
    }
    /* Configuring the file */
    const nameId = uuid()
    const fileToUpload = bucket.file(`${nameId}-${file.originalname}`)
    const blobStream = fileToUpload.createWriteStream({
      contentType: file.mimetype
    })
    /* Uploading the file */
    blobStream.on('error', error => {
      return reject(error)
    })
    blobStream.on('finish', () => {
      fileToUpload.getSignedUrl({
        action: 'read',
        expires: '12-12-2050'
      }).then(link => {
        return resolve(link[0])
      }).catch(error => {
        return reject(error)
      })
    })
    blobStream.end(file.buffer)
  })
}

export default getUrlFromFile