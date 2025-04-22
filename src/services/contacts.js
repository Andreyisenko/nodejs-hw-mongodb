import ContactCollection from '../db/models/contact.js';
import { sortList } from '../constants/index.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = sortList[0],
  filters = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactQuery = ContactCollection.find();
  if (filters.userId) {
    contactQuery.where('userId').equals(filters.userId);
  }

  const data = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

    const totalItems = await ContactCollection.find().countDocuments();
  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};

export const getContactsById = (contactId) =>
  ContactCollection.findOne({ _id: contactId });


export const addContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, option = {}) => {
  const { upsert } = option;
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      upsert,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContactById = async (contactId) => {
  const contact = ContactCollection.findOneAndDelete({ _id: contactId });
  return contact;
};
