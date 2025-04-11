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
import { contactAddSchema, contactUpdateSchema } from '../validation/contacts.js';
const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', validateBody(contactAddSchema), ctrlWrapper(addContactsController));

contactsRouter.put('/:contactId',  validateBody(contactAddSchema), ctrlWrapper(upsertContactsController));

contactsRouter.patch('/:contactId',   ctrlWrapper(patchContactsController));

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactsController));

export default contactsRouter;

// validateBody(contactUpdateSchema),