const Contact = require('./schemas/contact');

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

  const results = await Contact.paginate(optionsSearch, {
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
  const result = await Contact.create(body);
  return result;
};

// DELETE
const remove = async (userId, id) => {
  const result = await Contact.findByIdAndRemove({ _id: id, owner: userId });
  return result;
};

// UPDATE
const update = async (userId, id, body) => {
  const result = await Contact.findOneAndUpdate(
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

/**
 * Query string from Postman GET (all contacts)
 * http://localhost:3000/api/contacts?page=0&limit=15&favorite=true&filter=name|email|phone|favorite&sortByDesc=name
 */
