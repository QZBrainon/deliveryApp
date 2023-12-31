const userModel = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    }, {
      tableName: 'users',
      timestamps: false,
      underscored: true,
    });
  
    User.associate = (models) => {
      User.hasMany(models.Sale,{ foreignKey: 'userId', as: 'user'});
      User.hasMany(models.Sale,{ foreignKey: 'sellerId', as: 'seller' });
    }

    return User;
  };
  
  module.exports = userModel;