import createError from 'http-errors';
import { Contact } from '../models/contactModel.js';

export const getAllContacts = async (userId, query) => {
  const {
    page = 1,
    perPage = 10,
    sortBy,
    sortOrder = 'asc',
    type,
    isFavourite,
  } = query;

  const skip = (page - 1) * perPage;

  // Обов'язковий фільтр за userId
  const filter = { userId };

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

export const getContactById = async (userId, contactId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (userId, data) => {
  const newContact = await Contact.create({ ...data, userId });
  return newContact;
};

export const updateContactById = async (userId, contactId, data) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  return updatedContact;
};

export const deleteContactById = async (userId, contactId) => {
  const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  return deletedContact;
};
