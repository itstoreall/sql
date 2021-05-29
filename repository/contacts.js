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

  const optionsSearch = {
    page,
    limit,
    where: {
      owner: userId,
    },
    attributes: ['id', 'name', 'favorite', 'createdAt', 'updatedAt'],
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'email', 'favorite', 'gender'],
        include: { model: Gender },
      },
    ],
  };

  const order = [];
  if (sortBy) {
    order.push([`${sortBy}`]);
    optionsSearch.order = order;
  }
  if (sortByDesc) {
    order.push([`${sortByDesc}`, `DESC`]);
    optionsSearch.order = order;
  }
  if (filter) {
    const attributes = filter.split('|');
    optionsSearch.attributes = attributes;
  }

  const { count, rows: contacts } = await Contacts.findAndCountAll(
    optionsSearch,
  );

  return {
    total: count,
    limit,
    page,
    contacts,
  };
};

// GET by ID
const getById = async (userId, id) => {
  const contact = await Contacts.findOne({
    where: {
      id,
      owner: userId,
    },
  });
  return contact;
};

// POST
const create = async body => {
  const contact = await Contacts.create(body);
  return contact;
};

// DELETE
const remove = async (id, userId) => {
  const contact = await Contacts.findOne({
    where: {
      id,
      owner: userId,
    },
  });
  if (contact) {
    await Contacts.destroy({
      where: {
        id,
        owner: userId,
      },
    });
    return contact;
  }
  return null;
};

// UPDATE
const update = async (id, body, userId) => {
  await Contacts.update(body, {
    where: {
      id,
      owner: userId,
    },
  });
  const contact = await Contacts.findOne({
    where: {
      id,
      owner: userId,
    },
  });
  if (contact) {
    return contact;
  }
  return null;
};

module.exports = {
  getAll,
  getById,
  remove,
  create,
  update,
};
