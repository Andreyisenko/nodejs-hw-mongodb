import ContactCollection from '../db/models/contact.js';
import { sortList } from '../constants/index.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

// const cleanFilters = (filters) => {
//   return Object.fromEntries(
//     Object.entries(filters).filter(([_, v]) => v !== undefined),
//   );
// };

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = sortList[0],
  filters = {},
}) => {
  const skip = (page - 1) * perPage;
  // const cleanedFilters = cleanFilters(filters);
  // const contactQuery = ContactCollection.find(cleanedFilters);

  // if (filters.contactType) {
  //   contactQuery.where('contactType').equals(filters.contactType);
  // }
  // console.log(filters.contactType);

  // const data = await ContactCollection.find(cleanedFilters)
  //   .skip(skip)
  //   .limit(perPage)
  //   .sort({ [sortBy]: sortOrder });

  // const totalItems = await ContactCollection.countDocuments(cleanedFilters);
  // const paginationData = calcPaginationData({ page, perPage, totalItems });

  const contactQuery = ContactCollection.find();

  if (filters.contactType) {
    contactQuery.where('contactType').equals(filters.contactType);
  }
  console.log(typeof filters.contactType);

  const data = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const totalItems = await ContactCollection.find()
    .merge(contactQuery)
    .countDocuments();
  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};

export const getContactsById = (contactId) => {
  return ContactCollection.findOne({ _id: contactId });
};

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
