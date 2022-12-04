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

module.exports = {
    createSale,
};