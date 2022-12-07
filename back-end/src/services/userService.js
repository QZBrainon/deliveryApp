const md5 = require('md5');
const { Op } = require('sequelize');
const { User } = require('../database/models');
const { loginValidator } = require('../utils/loginValidator');
const { ErrorGenerator } = require('../utils/ErrorGenerator');
const { tokenGenerator } = require('../utils/tokenGenerator');

const findUserByEmail = async (email, password, name = 'xxxxxx') => {
    if (!email || !password) throw new ErrorGenerator(400, 'Required fields are missing');
    loginValidator(email, password);
    const user = await User.findOne({ where: { [Op.or]: [{ email }, { name }] } });
    return user;
};

const createUser = async ({name, email, password, role = 'customer'}) => {
    if (!name) throw new ErrorGenerator(400, 'Required fields are missing');
    if (name.length < 12) throw new ErrorGenerator(404, 'Dados de cadastro inválidos');
    const findUser = await findUserByEmail(email,password, name);
    if (findUser) throw new ErrorGenerator(409, 'Conflict');
    const passwordEncripted = md5(password);
    const userCreated = await User.create({ name, email, password: passwordEncripted, role });
    const token = tokenGenerator(userCreated.id, userCreated.name, userCreated.email, userCreated.role);
    return { name: userCreated.name, email: userCreated.email, role: userCreated. role, token };
};

const getSellers = async () => {
    const sellers = await User.findAll({
        attributes: { exclude: ['password'] },
        where: { role: 'seller' } });
    return sellers;
};

const getAllUsers = async () => {
  const allUsers = await User.findAll();
  return allUsers;
}

module.exports = {
    findUserByEmail,
    createUser,
    getSellers,
    getAllUsers,
};