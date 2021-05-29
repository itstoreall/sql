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

const create = async data => {
  const { name, email, password, gender = enumGender.NONE } = data;

  const genderDb = await Gender.findOne({
    where: {
      name: gender,
    },
  });

  const newUser = await User.create({
    name,
    email,
    password: await bcrypt.hash(
      password,
      bcrypt.genSaltSync(SALT_WORK_FACTOR),
      null,
    ),
    gender: genderDb.id,
  });

  return newUser;
};

const updateToken = async (id, token) => {
  return await User.update(
    { token },
    {
      where: {
        id,
      },
    },
  );
};

// const updateUserSubscription = async subscription => {
//   await User.updateOne({ subscription: String(subscription) });

//   return String(subscription);
// };

module.exports = {
  findById,
  findByEmail,
  findByToken,
  create,
  updateToken,
  // updateUserSubscription,
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
