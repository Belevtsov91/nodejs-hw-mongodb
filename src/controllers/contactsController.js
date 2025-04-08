import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contactsService.js';

export const handleGetAllContacts = async (req, res, next) => {
  try {
    const paginated = await getAllContacts(req.user._id, req.query);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: paginated,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(req.user._id, contactId);

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

export const handleCreateContact = async (req, res, next) => {
  try {
    const newContact = await createContact(req.user._id, req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateContactById(req.user._id, contactId, req.body);

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await deleteContactById(req.user._id, contactId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
