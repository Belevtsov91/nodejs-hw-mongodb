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
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js'; 

import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(handleGetAllContacts));

contactsRouter.get('/:contactId', isValidId, ctrlWrapper(handleGetContactById));

contactsRouter.post(
  '/',
  (req, res, next) => {
    console.log('🧪 req.body:', req.body); // debug
    console.log('🧪 req.file:', req.file); // debug
    next();
  },
  upload.single('photo'), 
  validateBody(createContactSchema),
  ctrlWrapper(handleCreateContact)
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'), 
  validateBody(updateContactSchema),
  ctrlWrapper(handleUpdateContact)
);

contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContact));

export default contactsRouter;
