const md5 = require('md5');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Op } = require('sequelize');
const { User } = require('../database/models');
const { loginValidator } = require('../utils/loginValidator');
const { ErrorGenerator } = require('../utils/ErrorGenerator');
const { tokenGenerator } = require('../utils/tokenGenerator');

const secret = fs.readFileSync('jwt.evaluation.key');

const findUserByEmail = async ({ email, password, name = 'xxxxxx' }) => {
    if (!email || !password) throw new ErrorGenerator(400, 'Required fields are missing');
    loginValidator(email, password);
    const user = await User.findOne({ where: { [Op.or]: [{ email }, { name }] } });
    // console.log('service')
    // console.log(user)
    return user;
};

const adminRoleVerify = (tokenAdmin) => {
  if (tokenAdmin) {
    const data = jwt.verify(tokenAdmin, secret);
    const { data: { role } } = data;
    return role === 'administrator';
  }
  return false;
};

const userValidation = async (user) => {
  if (!user.name) throw new ErrorGenerator(400, 'Required fields are missing');
  if (user.name.length < 12) throw new ErrorGenerator(404, 'Dados de cadastro inválidos');
  const findUser = await findUserByEmail(user);
  // console.log(findUser);
  if (findUser) throw new ErrorGenerator(409, 'Conflict');
};

const createUser = async (user, tokenAdmin) => {
  const isAdmin = adminRoleVerify(tokenAdmin);
  await userValidation(user);
  if (user.role && !isAdmin) throw new ErrorGenerator(401, 'Unauthorized');
  const passwordEncripted = md5(user.password);
  const userCreated = await User.create(
    { name: user.name,
      email: user.email,
      password: passwordEncripted,
      role: user.role || 'customer' },
  );
  const { id, name, email, role } = userCreated;
  const token = tokenGenerator(id, name, email, role);
  return { id, name, email, role, token };
};
  
const getSellers = async () => {
    const sellers = await User.findAll({
        attributes: { exclude: ['password'] },
        where: { role: 'seller' } });
    return sellers;
};

const getAllUsers = async (token) => {
  const data = jwt.verify(token, secret);
  const { data: { role } } = data;
  if (role !== 'administrator') throw new ErrorGenerator(401, 'Unauthorized');
  const allUsers = await User.findAll(
    { where: { role: { [Op.ne]: 'administrator' } },
    attributes: { exclude: ['password'] } },
    );
    return allUsers;
  };
  
  const deleteUser = async (token, id) => {
    const data = jwt.verify(token, secret);
    const { data: { role } } = data;
    // console.log('role no userService >>>>>>>', role);
  if (role !== 'administrator') throw new ErrorGenerator(401, 'Unauthorized');
  const deletedUser = await User.destroy({ where: { id } });
  return deletedUser;
};

module.exports = {
    findUserByEmail,
    createUser,
    getSellers,
    getAllUsers,
    deleteUser,
};