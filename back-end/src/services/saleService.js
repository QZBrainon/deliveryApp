const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Sale, SaleProduct, Product } = require('../database/models');
const { ErrorGenerator } = require('../utils/ErrorGenerator');

const createSaleProduct = async (saleId, products) => {
    const result = products.map((product) => (
        { saleId, productId: product.id, quantity: product.quantity }
    ));
    await SaleProduct.bulkCreate(result);
};

const createSale = async (sale) => {
    const { userId, sellerId, totalPrice, deliveryAddress, deliveryNumber, products } = sale;
    const saleCreated = await Sale.create(
        { userId, sellerId, totalPrice, deliveryAddress, deliveryNumber },
);
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

const detailedSale = async (id) => {
  const sale = await Sale.findOne({
    where: { id },
    include: [
      { model: Product,
        as: 'products',
        attributes: { exclude: ['urlImage'] },
        through: { as: 'qtd', attributes: ['quantity'] },
      },
    ],
  });
  return sale;
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