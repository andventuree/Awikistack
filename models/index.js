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
}, { //hooks and virtuals go into this options argument
  hooks: { //our html form doesn't have a urlTitle prop so you'll need to make one //will get nullNotAllowed error otherwise
    beforeValidate: function(page){ //we receive the instance itself as the argument
      if(page.title){
        // console.log(page.title.replace(/\s+/g, '_').replace(/\W/g, ''))
        page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
      }
    }
  },
  getterMethods: {
    route: function(){
      return '/wiki/' + this.urlTitle;
    }
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

Page.belongsTo(User, { as: 'author' });


module.exports = {
  db: db,
  Page: Page,
  User: User
};
