'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('clients', 'deliveryShift', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    // La Oliva has always delivered in the morning, so every existing La Oliva client is a day
    // client. Otro clients have no shift.
    await queryInterface.sequelize.query(
      `UPDATE clients SET "deliveryShift" = 'day' WHERE delivery = 'La Oliva'`,
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('clients', 'deliveryShift');
  },
};
