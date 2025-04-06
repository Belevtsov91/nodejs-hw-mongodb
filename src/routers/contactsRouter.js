

import { Router } from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
  handleCreateContact,
  handleUpdateContact,
  handleDeleteContact,
} from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';

const contactsRouter = Router();


contactsRouter.get('/', ctrlWrapper(handleGetAllContacts));


contactsRouter.get('/:contactId', isValidId, ctrlWrapper(handleGetContactById));


contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(handleCreateContact)
);


contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(handleUpdateContact)
);


contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContact));

export default contactsRouter;
