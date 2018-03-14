const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
module.exports = router;

//dont need /wiki because the middle-ware on app.js already applies it

// /wiki/
router.get('/', (req,res,next)=>{

});

// /wiki/
router.post('/', (req,res,next)=>{
  // console.log(req.body);
  let newPage = Page.build(req.body); //use .build for temp instance
  newPage.save() //need to save in order for it to temp persist in DB
    .then(()=>{
      console.log('Page was saved successfully!');
    })
    .catch((err)=>{
      next(err); //express middle-ware
    });
  console.log(newPage.title);

});

// /wiki/add
router.get('/add', (req,res,next)=>{
  res.render('addpage')
})


//one way of doing the build, other way is simply to pass in req.body, sequelize will know what to do
// let newPage = Page.build({ //use .build for temp instance
//   title: req.body.title,
//   content: req.body.content,
//   status: req.body.status
// });
// newPage.save() //need to save in order for it to temp persist in DB
//     .then(()=>{
//       console.log('Page was saved successfully!');
//     });
