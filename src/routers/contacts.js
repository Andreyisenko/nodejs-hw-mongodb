import Router from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactsByIdController,
  addContactsController,
  upsertContactsController,
  patchContactsController,
  deleteContactsController,
} from '../controllers/contacts.js';
import { validateBody } from '../utils/validateBody.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';

import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId .js';

import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';
const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get(
  '/',
  checkRoles(ROLES.TEACHER),
  ctrlWrapper(getContactsController),
);

contactsRouter.get(
  '/:contactId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  ctrlWrapper(getContactsByIdController),
);

contactsRouter.post(
  '/',
  checkRoles(ROLES.TEACHER),
  validateBody(contactAddSchema),
  ctrlWrapper(addContactsController),
);

contactsRouter.put(
  '/:contactId',
  checkRoles(ROLES.TEACHER),
  isValidId,
  validateBody(contactAddSchema),
  ctrlWrapper(upsertContactsController),
);

contactsRouter.patch(
  '/:contactId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactsController),
);

contactsRouter.delete(
  '/:contactId',
  checkRoles(ROLES.TEACHER),
  isValidId,
  ctrlWrapper(deleteContactsController),
);

// contactsRouter.post('/logout', ctrlWrapper(logoutController));

export default contactsRouter;
