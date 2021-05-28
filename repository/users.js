const { User, Gender } = require('../models');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
const { Gender: enumGender } = require('../helpers/constants');

const findById = async id => {
  return User.findOne({
    where: {
      id,
    },
  });
};

const findByEmail = async email => {
  return await User.findOne({
    where: {
      email,
    },
  });
};

const findByToken = async token => {
  return await User.findOne({
    where: {
      token,
    },
  });
};

const create = async options => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateUserSubscription = async subscription => {
  await User.updateOne({ subscription: String(subscription) });

  return String(subscription);
};

module.exports = {
  findById,
  findByEmail,
  findByToken,
  create,
  updateToken,
  updateUserSubscription,
};

/*
const findById = async id => {
  return await User.findOne({ _id: id });
};

const findByEmail = async email => {
  return await User.findOne({ email });
};

const findByToken = async token => {
  return await User.findOne({ token });
};

const create = async options => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateUserSubscription = async subscription => {
  await User.updateOne({ subscription: String(subscription) });

  return String(subscription);
};

module.exports = {
  findById,
  findByEmail,
  findByToken,
  create,
  updateToken,
  updateUserSubscription,
};
*/
