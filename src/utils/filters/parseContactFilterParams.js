import { contactTypeList } from '../../constants/contacts.js';

export const parseContactFilterParams = ({ contactType }) => {
  const parsedType = contactTypeList.includes(contactType)
    ? contactType
    : undefined;

  return {
    contactType: parsedType,
  };
};
