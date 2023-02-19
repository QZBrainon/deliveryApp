module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('sales_products', {
        sale_id:{
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: { model: 'sales', key: 'id' },
          type: Sequelize.INTEGER,
        },
        product_id:{
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: { model: 'products', key: 'id' },
          type: Sequelize.INTEGER,
          },
        quantity:{
          allowNull: false,
          type: Sequelize.INTEGER,
        },
      });
    },
  
    down: async (queryInterface, Sequelize) => {
       await queryInterface.dropTable('sales_products');
    }
  };