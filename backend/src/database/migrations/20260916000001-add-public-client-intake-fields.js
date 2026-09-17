'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('clients', 'isDraft', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('clients', 'preferredStartDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('clients', 'weight', {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('clients', 'height', {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('clients', 'operations', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });
    await queryInterface.addColumn('clients', 'medications', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });
    await queryInterface.changeColumn('clients', 'delivery', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addIndex('clients', ['phoneNumber'], {
      name: 'clients_phone_number_active_unique',
      unique: true,
      where: { deletedAt: null },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('clients', 'clients_phone_number_active_unique');
    await queryInterface.changeColumn('clients', 'delivery', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.removeColumn('clients', 'medications');
    await queryInterface.removeColumn('clients', 'operations');
    await queryInterface.removeColumn('clients', 'height');
    await queryInterface.removeColumn('clients', 'weight');
    await queryInterface.removeColumn('clients', 'preferredStartDate');
    await queryInterface.removeColumn('clients', 'isDraft');
  },
};
