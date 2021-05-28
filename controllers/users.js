const jwt = require('jsonwebtoken');
require('dotenv').config();
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Signup
const reg = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        ResponseBody: { message: 'Email in use' },
      });
    }

    const newUser = await Users.create(req.body);
    const { email, subscription } = newUser;

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      ResponseBody: { user: { email, subscription } },
    });
  } catch (e) {
    next(e);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' }); // '1d' - one day
    await Users.updateToken(user.id, token); // Записываем token

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      ResponseBody: { token, user: { email, subscription: user.subscription } },
    });
  } catch (e) {
    next(e);
  }
};

// Logout
const logout = async (req, res, next) => {
  try {
    await Users.updateToken(req.user.id, null);

    return res.status(HttpCode.NO_CONTENT).json({
      status: 'success',
      code: HttpCode.NO_CONTENT,
    });
  } catch (e) {
    next(e);
  }
};

// Current
const current = async (req, res, next) => {
  try {
    const { email, subscription } = await Users.findByToken(req.user.token);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      ResponseBody: { email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

// Update Subscription
const updateSubscription = async (req, res, next) => {
  try {
    const subscriptions = ['starter', 'pro', 'business'];
    const value = req.body.subscription;

    if (value >= 0 && value <= 2) {
      const idx = subscriptions.filter((_, idx) => {
        return idx === req.body.subscription;
      });

      const result = await Users.updateUserSubscription(idx);

      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        ResponseBody: { subscription: result },
      });
    }

    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      ResponseBody: 'The value must be range from 0 to 2',
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { reg, login, current, logout, updateSubscription };

/**
 * В контроллерах находится вся логика работы
 */
