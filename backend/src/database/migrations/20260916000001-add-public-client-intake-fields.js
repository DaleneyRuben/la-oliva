'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('clients');
    const addColumnIfMissing = (name, definition) =>
      columns[name] ? Promise.resolve() : queryInterface.addColumn('clients', name, definition);

    await addColumnIfMissing('isDraft', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await addColumnIfMissing('preferredStartDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await addColumnIfMissing('weight', {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: true,
    });
    await addColumnIfMissing('height', {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: true,
    });
    await addColumnIfMissing('operations', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });
    await addColumnIfMissing('medications', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });
    await queryInterface.changeColumn('clients', 'delivery', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
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
