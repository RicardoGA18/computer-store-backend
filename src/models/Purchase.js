import { Schema , model } from 'mongoose'

const PurchaseProductSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
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

const PurchaseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  mercadoPagoId: {
    type: String,
    required: true,
  },
  products: [PurchaseProductSchema],
},{
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
  versionKey: false,
})

export default model('Purchase', PurchaseSchema)