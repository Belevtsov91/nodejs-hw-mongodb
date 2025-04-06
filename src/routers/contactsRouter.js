import { Router } from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
  handleCreateContact, 
  handleUpdateContact,
  handleDeleteContact,
} from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; 

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(handleGetAllContacts));
contactsRouter.get('/:contactId', ctrlWrapper(handleGetContactById));
contactsRouter.post('/', ctrlWrapper(handleCreateContact)); 
contactsRouter.patch('/:contactId', ctrlWrapper(handleUpdateContact)); 
contactsRouter.delete('/:contactId', ctrlWrapper(handleDeleteContact));

export default contactsRouter;
