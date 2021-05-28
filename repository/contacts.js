const { Contact: Contacts, User, Gender } = require('../models');

// GET
const getAll = async (userId, query) => {
  const {
    limit = 5, // Limits the number of requests
    page = 0,
    sortBy, // Sorting in ascending order
    sortByDesc, // Sorting in descending order
    filter, // Filtration: name|email|phone|favorite
    favorite = false, // Filtration by field
  } = query; // query from controllers/contacts.js

  const optionsSearch = { owner: userId };

  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  }

  const results = await Contacts.paginate(optionsSearch, {
    limit,
    page,
    select: filter ? filter.split('|').join(' ') : '',
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}), // Sorting in ascending order
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}), // Sorting in descending order
    }, //
  }); // docs
  const { docs: contacts, totalDocs: total } = results;

  return { contacts, total, limit, page };
};

// GET by ID
const getById = async (userId, id) => {
  const result = await Contact.findOne({ _id: id, owner: userId }).populate({
    // Substants the value and fields of the document instead of ID
    path: 'owner',
    select: 'name email -_id', // -_id (removes the field from output)
  });
  return result;
};

// POST
const create = async body => {
  const result = await Contacts.create(body);
  return result;
};

// DELETE
const remove = async (userId, id) => {
  const result = await Contacts.findByIdAndRemove({ _id: id, owner: userId });
  return result;
};

// UPDATE
const update = async (userId, id, body) => {
  const result = await Contacts.findOneAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true },
  );
  return result;
};

module.exports = {
  getAll,
  getById,
  remove,
  create,
  update,
};
