import { Schema } from 'mongoose'

const PurchaseSchema = new Schema({
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  products: [PurchaseProductSchema],
},{
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
  versionKey: false,
})

const PurchaseProductSchema = new Schema({
  _id:{
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  img: {
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
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
},{
  timestamps: false,
  versionKey: false,
  _id: false,
})

export default PurchaseSchema