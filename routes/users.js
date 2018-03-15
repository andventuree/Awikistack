const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;
const Promise = require('bluebird'); //is a dependency of sequelize
module.exports = router;


// GET /user
router.get('/', (req,res,next)=>{
  User.findAll()
  .then((allUsers)=>{
    res.render('users', {
      users: allUsers
    })
  })
  .catch(next)
})

// GET /user/id
router.get('/:userId', (req,res,next)=>{
  let findingUserPages = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });

  let findingUser = User.findById(req.params.userId) //already know which id we want so no special query conditions

  Promise.all([ findingUserPages, findingUser])
  .then((values)=>{ //can use .spread as well
    let pages = values[0]; // result of findingUserPages query
    let user = values[1]; // result of findingUser query

    res.render('userpage', {
      user: user
    })

  })

})
