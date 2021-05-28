const Contacts = require('../repository/contacts');
const { HttpCode } = require('../helpers/constants');

// GET
const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id; // provides access to users in controllers

    // Data
    const { contacts, total, limit, page } = await Contacts.getAll(
      userId,
      req.query, // req.query - pagination
    );

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { total, limit, page, contacts },
    });
  } catch (error) {
    next(error);
  }
};

// GET by ID
const getById = async (req, res, next) => {
  try {
    const userId = req.user.id; // provides access to users in controllers
    const contact = await Contacts.getById(userId, req.params.id);
    console.log(contact); // toObject

    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, contact });
    }
    
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not Found',
    }); // toJSON
  } catch (error) {
    next(error);
  }
};

// CREATE
const create = async (req, res, next) => {
  try {
    const userId = req.user.id; // provides access to users in controllers
    const contact = await Contacts.create({ ...req.body, owner: userId });

    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { contact } });
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.status = HttpCode.BAD_REQUEST;
    }
    next(error);
  }
};

// DELETE
const remove = async (req, res, next) => {
  try {
    const userId = req.user.id; // provides access to users in controllers
    const contacts = await Contacts.remove(userId, req.params.id);

    if (contacts) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'contact deleted',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not Found',
    });
  } catch (error) {
    next(error);
  }
};

// Update (PUT & PATCH)
const update = async (req, res, next) => {
  try {
    const userId = req.user.id; // provides access to users in controllers
    const contact = await Contacts.update(userId, req.params.id, req.body);

    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, contact });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not Found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
};

/**
 * Вся логика работы находится в контроллерах
 * точнее, все что отдается - взаимодейсвие.
 *
 * Из контроллеров осуществляется работа с моделями
 */
