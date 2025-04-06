import createError from 'http-errors';
import { Contact } from '../models/contactModel.js';

export const getAllContacts = async (query) => {
  const {
    page = 1,
    perPage = 10,
    sortBy,
    sortOrder = 'asc',
    type,
    isFavourite,
  } = query;

  const skip = (page - 1) * perPage;

  
  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  
  const sortOptions = {};
  if (sortBy) sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const totalItems = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
    .skip(skip)
    .limit(perPage)
    .sort(sortOptions);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
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