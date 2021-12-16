'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
          {
              name: 'testuser-shinjuku',
              email: "testuser-shinjuku@gmail.com",
              lat: "35.690921",
              lng: "139.70025799999996",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-foresthill',
              email: "testuser-foresthill@gmail.com",
              lat: "38.26561307122129",
              lng: "140.85940695885157",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-enspace',
              email: "testuser-enspace@gmail.com",
              lat: "38.2611019619415",
              lng: "140.8684612552719",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
        ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
