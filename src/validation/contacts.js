import Joi from 'joi';
import { isValidObjectId } from 'mongoose';
import { contactTypeList } from '../constants/contacts.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'name must be at least 3 characters',
    'string.max': 'name must be no more than 20 characters',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.min': 'phoneNumber must be at least 3 characters',
    'string.max': 'phoneNumber must be no more than 20 characters',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.min': 'email must be at least 3 characters',
    'string.max': 'email must be no more than 20 characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...contactTypeList)
    .required(),
  parentId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Parent id should be a valid mongo id');
    }
    return true;
  }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.min': 'name must be at least 3 characters',
    'string.max': 'name must be no more than 20 characters',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.min': 'phoneNumber must be at least 3 characters',
    'string.max': 'phoneNumber must be no more than 20 characters',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.min': 'email must be at least 3 characters',
    'string.max': 'email must be no more than 20 characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactTypeList),
});
