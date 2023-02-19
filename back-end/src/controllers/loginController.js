const md5 = require('md5');
const { ErrorGenerator } = require('../utils/ErrorGenerator');
const { userService } = require('../services');
const { tokenGenerator } = require('../utils/tokenGenerator');

const login = async (req, res, next) => {
  try {
    const user = await userService.findUserByEmail(req.body);
    if (!user) throw new ErrorGenerator(404, 'Not found');
    const { id, name, email, role, password } = user;
    if (md5(req.body.password) !== password) throw new ErrorGenerator(409, 'Unauthorized');
    const token = tokenGenerator(id, name, email, role);
     return res.status(200).json({ name, email, role, token });
  } catch (error) {
      next(error);
  }
};

module.exports = {
    login,
};