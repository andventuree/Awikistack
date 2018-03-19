'use strict'

const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false //setting false logging doesn't log what DB .sync({force:true}) and other DB things
});

let Page = db.define('page', { //this is second arg that defines schema
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW //don't need to add yourself then
  }
}, {
  getterMethods: { //dont need to call them and can be accessed as properties
    route: function(){
      // console.log('/wiki/' + this.getDataValue('title'))
      return '/wiki/' + this.urlTitle;
    }
  },
  hooks: { //executes in between life cycle events
    beforeValidate: function (page) {
      if (page.title) {
        page.urlTitle = page.title.replace(/\s/g, '_').replace(/\W/g, '');
      } else {
        //will make random string title if no title is provided
        page.urlTitle = Math.random().toString(36).substring(2, 7);
      }
    }
  }
})

let User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true //http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations
    }
  }
})

module.exports = {
  db,
  Page,
  User
}
