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
  // const { contactId } = req.params;
  // console.log(req.user);
  filters.userId = req.user._id;
  // console.log(filters.userId);

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
  const stringId = data.userId.toString();
  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  if (stringUserId !== stringId) {
    throw createHttpError(401, 'No access to contact');
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
  const { id } = req.params;
  const { data, isNew } = await updateContact(id, req.body, { upsert: true });
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
  const result = await updateContact(contactId, req.body);
  const stringId = result.data.userId.toString();

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  if (stringUserId !== stringId) {
    throw createHttpError(401, 'No access to contact');
  }

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
  const data = await deleteContactById(contactId);
  const stringId = data.userId.toString();

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  if (stringUserId !== stringId) {
    throw createHttpError(401, 'No access to contact');
  }

  res.status(204).send();
};
