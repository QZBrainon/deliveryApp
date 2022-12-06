const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Sale, SaleProduct } = require('../database/models');

// const { ErrorGenerator } = require('../utils/ErrorGenerator');

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
    console.log('>>>>>>>', token);
    const data = jwt.verify(token, fs.readFileSync('jwt.evaluation.key'));
    const { data: { id, role } } = data;
    console.log('>>>>>>>', id, role);
    let sales;
    if (role === 'customer') {
        sales = await Sale.findAll({ where: { userId: id } });
        return sales;
    } 
        sales = await Sale.findAll({ where: { sellerId: id } });
        return sales;
};

module.exports = {
    createSale,
    findSalesById,
};