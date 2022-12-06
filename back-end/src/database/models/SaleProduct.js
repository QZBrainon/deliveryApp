const saleProductModel = (sequelize, DataTypes) => {
    const SaleProduct = sequelize.define('SaleProduct', {
      saleId: { type: DataTypes.INTEGER, foreignKey: true },
      productId: { type: DataTypes.INTEGER, foreignKey: true },
      quantity: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      tableName: 'salesProducts',
      underscored: true,
    });
    SaleProduct.associate = (models) => {
      models.Sale.belongsToMany(models.Product,
        { foreignKey: 'saleId', as: 'products', through: 'SaleProduct', otherKey: 'productId' });
      models.Product.belongsToMany(models.Sale,
        { foreignKey: 'productId', as: 'sale', through: 'SaleProduct', otherKey: 'saleId' })
    };
    return SaleProduct;
  };
  
  module.exports = saleProductModel;