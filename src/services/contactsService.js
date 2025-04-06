import createError from 'http-errors';
import { Contact } from '../models/contactModel.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

export const createContact = async (data) => {
  const newContact = await Contact.create(data);
  return newContact;
};

export const updateContactById = async (id, data) => {
  const updatedContact = await Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  return updatedContact;
};

export const deleteContactById = async (id) => {
  const deletedContact = await Contact.findByIdAndDelete(id);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  return deletedContact;
};