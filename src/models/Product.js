import { Schema } from 'mongoose'

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
    required: true,
  },
  oficialInformation: {
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
  details: [ProductDetailSchema],
},{
  timestamps: true,
  versionKey: false,
})

export default ProductSchema