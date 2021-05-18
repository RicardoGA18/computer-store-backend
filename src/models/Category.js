import { Schema , model } from 'mongoose'

const CategorySchema = new Schema({
  img: {
    type: String,
    default: "https://firebasestorage.googleapis.com/v0/b/computer-store-a1f8e.appspot.com/o/assets%2FGroup%202.png?alt=media&token=0c75a57c-5005-4efb-b4e8-82a69b5c8849",
  },
  name: {
    type: String,
    required: true,
  },
},{
  timestamps: true,
  versionKey: false,
})

export default model('Category',CategorySchema)