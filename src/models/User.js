import { Schema , model } from 'mongoose'
import { hashSync , compareSync } from 'bcryptjs'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 40,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 40,
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  role: {
    type: String,
    default: 'client',
    enum: {
      values: ['client','admin'],
      message: '{VALUE} is not a valid role',
    },
  },
},{
  timestamps: true,
  versionKey: false,
})

UserSchema.statics.encryptPassword = password => {
  return hashSync(password, 10)
}

UserSchema.statics.comparePassword = ( password , hashPassword ) => {
  return compareSync(password,hashPassword)
}

export default model('User',UserSchema)