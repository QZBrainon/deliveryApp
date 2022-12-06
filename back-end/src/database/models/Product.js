const productModel = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING,
        price: DataTypes.DECIMAL,
        urlImage: DataTypes.STRING,
    }, {
        tableName: 'products',
        timestamps: false,
        underscored: true,
    });

    return Product;
};

module.exports = productModel;