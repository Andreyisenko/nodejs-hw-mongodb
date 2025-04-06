import Router from 'express';
import { ctrlWrapper } from '../utils/trrlWrapper.js';
import {
  getContactsController,
  getContactsByIdController,
  addContactsController,
  upsertContactsController,
  patchContactsController,
} from '../controllers/contacts.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', ctrlWrapper(addContactsController));

contactsRouter.put('/:contactId', ctrlWrapper(upsertContactsController));

contactsRouter.patch('/:contactId', ctrlWrapper(patchContactsController));

export default contactsRouter;
