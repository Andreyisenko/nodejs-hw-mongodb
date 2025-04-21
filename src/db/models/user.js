import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';
import { emailRegexp } from '../../constants/auth.js';
import { ROLES } from '../../constants/index.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, match: emailRegexp, unique: true, required: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: [ROLES.TEACHER, ROLES.PARENT],
      default: ROLES.PARENT,
    },
  },

  {
    versionKey: false,
    timestamps: true,
  },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', setUpdateSettings);

userSchema.post('findOneAndUpdate', handleSaveError);

const userCollection = model('user', userSchema);

export default userCollection;
