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
  },
  description:{
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
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
    required: true,
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