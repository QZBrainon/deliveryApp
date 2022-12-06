const { saleService } = require('../services');

const createSale = async (req, res, next) => {
  try {
    const result = await saleService.createSale(req.body);
    return res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const findSalesById = async (req, res, next) => {
  try {
    const sales = await saleService.findSalesById(req.headers.authorization);
    return res.status(200).json(sales);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createSale,
  findSalesById,
};