import { Schema , model } from 'mongoose'

const ProductDetailSchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  }
},{
  timestamps: false,
  versionKey: false,
  _id: false,
})

const ProductSchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description:{
    type: String,
    required: true,
  },
  img: {
    type: String,
    default: 'https://firebasestorage.googleapis.com/v0/b/computer-store-a1f8e.appspot.com/o/assets%2FGroup%203.png?alt=media&token=520fa3d8-be24-4bb1-9109-027f322d389f'
  },
  officialInformation: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  slides: {
    type: [String],
    default: ['https://firebasestorage.googleapis.com/v0/b/computer-store-a1f8e.appspot.com/o/assets%2FGroup%203.png?alt=media&token=520fa3d8-be24-4bb1-9109-027f322d389f']
  },
  details: {
    type: [ProductDetailSchema],
    required: true,
  },
},{
  timestamps: true,
  versionKey: false,
})

export default model('Product',ProductSchema)