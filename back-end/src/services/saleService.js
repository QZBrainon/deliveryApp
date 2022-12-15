const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Op } = require('sequelize');
const { Sale, SaleProduct, Product, User } = require('../database/models');
const { ErrorGenerator } = require('../utils/ErrorGenerator');

const createSaleProduct = async (saleId, products) => {
    const result = products.map((product) => (
        { saleId, productId: product.id, quantity: product.quantity }
    ));
    await SaleProduct.bulkCreate(result);
};

const createSale = async (sale) => {
    const { 
      userId, sellerId, totalPrice, deliveryAddress, deliveryNumber, products,
    } = sale;
    const saleCreated = await Sale.create({ 
      userId, sellerId, totalPrice, deliveryAddress, deliveryNumber, 
    });
    
    await createSaleProduct(saleCreated.id, products);

    return saleCreated;
};

const findSalesById = async (token) => {
    const data = jwt.verify(token, fs.readFileSync('jwt.evaluation.key'));
    const { data: { id, role } } = data;
    let sales;
    if (role === 'customer') {
      sales = await Sale.findAll({ where: { userId: id } });
      return sales;
    } 
    sales = await Sale.findAll({ where: { sellerId: id } });
    return sales;
};

const saleByUserId = async (id, saleId) => {
  const sale = await Sale.findOne({
    where: { [Op.and]: [{ id: saleId }, { userId: id }] },
    attributes: { exclude: ['UserId'] },
    include: [
      { model: User,
        as: 'seller',
        attributes: ['name'],
      },
      { model: Product,
        as: 'products',
        attributes: { exclude: ['urlImage'] },
        through: { as: 'qtd', attributes: ['quantity'] },
      },
    ],
  });
  if (!sale) throw new ErrorGenerator(409, 'Unauthorized');
  return sale;
};

const saleBySellerId = async (id, saleId) => {
  const sale = await Sale.findOne({
    where: { [Op.and]: [{ id: saleId }, { sellerId: id }] },
    attributes: { exclude: ['UserId'] },
    include: [
      { model: User,
        as: 'seller',
        attributes: ['name'],
      },
      { model: Product,
        as: 'products',
        attributes: { exclude: ['urlImage'] },
        through: { as: 'qtd', attributes: ['quantity'] },
      },
    ],
  });
  if (!sale) throw new ErrorGenerator(409, 'Unauthorized');
  return sale;
};

const detailedSale = async (saleId, token) => {
  const data = jwt.verify(token, fs.readFileSync('jwt.evaluation.key'));
  const { data: { id, role } } = data;
  if (role === 'customer') {
    return saleByUserId(id, saleId); 
  } 
  return saleBySellerId(id, saleId); 
};

const updateSaleStatus = async (id, { status }) => {
  if (status !== 'Em Trânsito' && status !== 'Preparando' && status !== 'Entregue') {
    throw new ErrorGenerator(401, 'o status deve ser "Em Trânsito", "Preparando" ou "Entregue"');
  }
  Sale.update({ status }, { where: { id } });
};

module.exports = {
    createSale,
    findSalesById,
    detailedSale,
    updateSaleStatus,
};