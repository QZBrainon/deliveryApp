const { userService } = require('../services');

const createUser = async (req, res, next) => {
  try {
    const tokenAdmin = req.headers.authorization || false;
    const result = await userService.createUser(req.body, tokenAdmin);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getSellers = async (_req, res, next) => {
  try {
    const sellers = await userService.getSellers();
    return res.status(200).json(sellers);
  } catch (error) {
      next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    console.log('token no userController >>>>>>>', req.authorization);

    const { authorization } = req.headers;
    const allUsers = await userService.getAllUsers(authorization);
    return res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const { id } = req.params;
    await userService.deleteUser(authorization, id);
    return res.status(204).json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
    
module.exports = {
    createUser,
    getSellers,
    getAllUsers,
    deleteUser,
};