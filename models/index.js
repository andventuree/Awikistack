let Sequelize = require('sequelize'); //constructor class suggest using new keyword
let db = new Sequelize('postgres://localhost:5432/awikistack', {
  logging: false
}); // symbolizes db making connection
let marked = require('marked');

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
    allowNull: false,
    get: function(){ //making a virtual that really isnt a virtual, cause it sits on a column
      return marked(this.content); //instead of putting here, lets put on a virtual
    }
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT), //this ARRAY method only works for sequelize, not other ORMs
    set: function(value){
      let arrayOfTags;
      if(typeof value === 'string'){
        arrayOfTags = value.split(',').map((eachTag)=>{
          return eachTag.trim()
        })
        // this.tags = arayOfTags; //could not have just done this cause you'd be caught in infinite loop
        this.setDataValue('tags', arrayOfTags); //setter prevents loop and replaces input with clean tags for our DB
      } else {
        this.setDataValue('tags', value) //if value is already an arrray
      }

    }
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
    },
    renderedContent: function(){
      return marked(this.content);
    }
  }
});

Page.prototype.classMethods = function(){
  Page.findByTag = function (tag){
    return Page.findAll({
      where: {
        tags: {
          $overlap: [tags]
        }
      }
    })
  }
}

Page.prototype.findSimilar = function(){
  Page.findSimilar =  function(){
    return Page.findAll({
      where: {
        tags: {
          $overlap: this.tags
        },
        id: {
          $ne: this.id //filter out the current tag (this.tag)
        }
      }
    })
  }
}

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
