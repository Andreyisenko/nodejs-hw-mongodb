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
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
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
  // console.log(contactId);

  const userId = req.user._id;
  const stringUserId = userId.toString();
  const data = await getContactsById(contactId);
  // console.log(data);
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
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const data = await addContact({ ...req.body, userId, photo: photoUrl });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactsController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  // console.log(userId);

  const stringUserId = userId.toString();

  const dataContact = await getContactsById(contactId);

  if (dataContact) {
    const stringId = dataContact.userId.toString();

    if (stringUserId !== stringId) {
      throw createHttpError(404, 'Contact not found');
    }
  }
  const { data, isNew } = await updateContact(
    contactId,
    { ...req.body, userId },
    { upsert: true },
  );

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully update contact',
    data,
  });
};

export const patchContactsController = async (req, res, next) => {
  const userId = req.user._id;
  const stringUserId = userId.toString();

  const { contactId } = req.params;
  const photo = req.file;
  const data = await getContactsById(contactId);
  let photoUrl;

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  const stringId = data.userId.toString();
  if (stringUserId !== stringId) {
    throw createHttpError(404, 'Contact not found');
  }

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(contactId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
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

// export const patchContactsController = async (req, res, next) => {
//   const { contactId } = req.params;
//   const photo = req.file;
// };
