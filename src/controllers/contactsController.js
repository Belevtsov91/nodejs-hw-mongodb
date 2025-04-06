import { getAllContacts } from '../services/contactsService.js';
import { getContactById } from '../services/contactsService.js';
import { createContact } from '../services/contactsService.js';
import { updateContactById } from '../services/contactsService.js';
import { deleteContactById } from '../services/contactsService.js';

export const handleGetAllContacts = async (req, res) => {
  const paginated = await getAllContacts(req.query);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: paginated,
  });
};

export const handleGetContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line no-unused-vars
export const handleCreateContact = async (req, res, next) => {
  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// eslint-disable-next-line no-unused-vars
export const handleUpdateContact = async (req, res, next) => {
  const { contactId } = req.params;

  const updatedContact = await updateContactById(contactId, req.body);

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};
// eslint-disable-next-line no-unused-vars
export const handleDeleteContact = async (req, res, next) => {
  const { contactId } = req.params;

  await deleteContactById(contactId);

  res.status(204).send(); // 🔥 Статус 204 — без тіла відповіді
};