import { Schema, model } from 'mongoose';

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
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      require: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const ContactCollection = model('contact', contactSchema);
export default ContactCollection;
