import { Schema , model } from 'mongoose'
import ProductSchema from './Product'

const CategorySchema = new Schema({
  img: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  products: [ProductSchema],
},{
  timestamps: true,
  versionKey: false,
})

export default model('Category',CategorySchema)