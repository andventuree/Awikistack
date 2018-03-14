let Sequelize = require('sequelize'); //constructor class suggest using new keyword
let db = new Sequelize('postgres://localhost:5432/awikistack', {
  logging: false
}); // symbolizes db making connection

// each table in db will have createdAt and updatedAt columns to give you timestamp of when record was made

const Page = db.define('page', {
  title: {
      type: Sequelize.STRING,
      allowNull: false //does NOT allow value to be null
  },
  urlTitle: {
      type: Sequelize.STRING,
      allowNull: false
  },
  content: {
      type: Sequelize.TEXT,
      allowNull: false
  },
  status: {
      type: Sequelize.ENUM('open', 'closed')
  }
});

const User = db.define('user', {
  name: {
      type: Sequelize.STRING,
      allowNull: false
  },
  email: {
      type: Sequelize.STRING,
      allowNull: false, //this is application level, the database!
      unique: true,
      validate: {
        isEmail: true //nested because it makes Sequelize check if its a valid email
      }
  }
});

module.exports = {
  db: db,
  Page: Page,
  User: User
};
