import createHttpError from 'http-errors';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactSortFields } from '../db/models/contact.js';
import {
  getContacts,
  getContactsById,
  addContact,
  updateContact,
  deleteContactById,
} from '../services/contacts.js';
import { parseContactFilterParams } from '../utils/filters/parseContactFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
export const getContactsController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query, contactSortFields);
  const filters = parseContactFilterParams(req.query);
  filters.userId = req.user._id;

  const data = await getContacts({
    ...paginationParams,
    ...sortParams,
    filters,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;

  const userId = req.user._id;
  const stringUserId = userId.toString();
  const data = await getContactsById(contactId);
  console.log(data);
  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }
  const stringId = data.userId.toString();

  if (stringUserId !== stringId) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

export const addContactsController = async (req, res) => {
  const { _id: userId } = req.user;

  const data = await addContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactsController = async (req, res) => {
  const { contactId } = req.params;
 const userId = req.user._id;
 const stringUserId = userId.toString();
 

 const dataContact = await getContactsById(contactId);
 
 if (dataContact) {
   const stringId = dataContact.userId.toString();
 
   if (stringUserId !== stringId) {
     throw createHttpError(404, 'Contact not found');
   }

}
 const { data, isNew } = await updateContact(contactId, { ...req.body, userId }, { upsert: true });
 
   const status = isNew ? 201 : 200;

 

  res.status(status).json({
    status,
    message: 'Successfully update contact',
    data,
  });
};



export const patchContactsController = async (req, res) => {
  const userId = req.user._id;
  const stringUserId = userId.toString();

  const { contactId } = req.params;
  
  const data = await getContactsById(contactId);
  
  
  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }


  
  const stringId = data.userId.toString();
  if (stringUserId !== stringId) {
    throw createHttpError(404, 'Contact not found');
  }

  const result = await updateContact(contactId, req.body);


  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};




export const deleteContactsController = async (req, res) => {
  const userId = req.user._id;
  const stringUserId = userId.toString();

  const { contactId } = req.params;

  const data = await getContactsById(contactId);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }
  const stringId = data.userId.toString();

  if (stringUserId !== stringId) {
    throw createHttpError(404, 'Contact not found');
  }

  await deleteContactById(contactId);

  res.status(204).send();
};
