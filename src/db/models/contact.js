import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';
import { contactTypeList } from '../../constants/contacts.js';
// import { type } from 'node:os';
const contactSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },

    isFavourite: {
      type: Boolean,
      default: false,
      require: true,
    },
    contactType: {
      type: String,
      enum: contactTypeList,
      default: contactTypeList[2],
      require: true,
    },
    photo: { type: String },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

contactSchema.post('save', handleSaveError);

contactSchema.pre('findOneAndUpdate', setUpdateSettings);

contactSchema.post('findOneAndUpdate', handleSaveError);
export const contactSortFields = [
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  // 'contactType',
];

const ContactCollection = model('contact', contactSchema);
export default ContactCollection;
