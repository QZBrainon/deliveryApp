const saleModel = (sequelize, DataTypes) => {
    const Sale = sequelize.define('Sale', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, foreignKey: true },
      sellerId: { type: DataTypes.INTEGER, foreignKey: true },
      totalPrice: DataTypes.DECIMAL(9,2),
      deliveryAddress: DataTypes.STRING,
      deliveryNumber: DataTypes.STRING,
      saleDate: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
      status: {type: DataTypes.STRING, defaultValue: 'Pendente'},
    },
    {
      createdAt: 'saleDate',
      tableName: 'sales',
      underscored: true,
      timestamps: false,
    });
  
    Sale.associate = (models) => {
      Sale.belongsTo(models.User,
        [{ foreignKey: 'userId', as: 'user' },
      { foreignKey: 'sellerId', as: 'seller' }]);
    };
  
    return Sale;
  };
  
  module.exports = saleModel;