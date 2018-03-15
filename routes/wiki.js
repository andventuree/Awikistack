const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;
module.exports = router;

//dont need /wiki because the middle-ware on app.js already applies it

// GET /wiki/
router.get('/', (req,res,next)=>{
  // res.render('index');
  Page.findAll({})
  .then((thePages)=>{
    res.render('index', {
      pages: thePages
    })
  })
  .catch(next);

});

// POST /wiki/
router.post('/', (req,res,next)=>{

    // not needed anymore becuase of below
        // // console.log(req.body); //you'll find form properties from html page on this obj
        // // although req.body will not appear on the newPage DB instance!!!!
        // let newPage = Page.build(req.body); //use .build for temp instance
        // newPage.save() //need to save in order for it to temp persist in DB
        //   .then((savedPage)=>{
        //     res.redirect('/wiki/' + savedPage.urlTitle);
        //   })
        //   .catch((err)=>{
        //     next(err); //express middle-ware
        //   });

    User.findOrCreate({
      where: {
        name: req.body.authorName,
        email: req.body.authorEmail
      }
    })
    // .then((values)=>{ //resolved to 2 values, [pageThatWasFoundOrCreated, createdBooleanIfFound] // values[1] // if user was created or not
    //   var user = values[0];
    // })
    .spread((user, userWasCreatedBool)=>{ //spread out the returned above from above //from bluebird NPM
      return Page.create({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status
      }).then((createdPage)=>{
        return createdPage.setAuthor(user); //.setAuthor relationship method comes from Page.belongsTo model
        //this method is async because it touches database
      })
    }).then((createdPage)=>{
      res.redirect(createdPage.route);
    })
    .catch(next);
    // User.create() //build and save rolled into one method
  // let newUser = User.build({ //rewrote this with above
  //   name: req.body.authorName,
  //   email: req.body.authorEmail
  // });
  // newUser.save()
  //   .then((savedUser)=>{ console.log('user saved') })
  //   .catch(next);
});

// GET /wiki/add
router.get('/add', (req,res,next)=>{
  res.render('addpage')
})

// GET /wiki/titleName-santitized
router.get('/:urlTitle', (req,res,next)=>{
  let urlTitleOfAPage = req.params.urlTitle;
  console.log(urlTitleOfAPage);
  //findById, findAll, findOne
  Page.find({ //will return array of pages //Sequelize returns back promises
    where: {
      urlTitle: urlTitleOfAPage
    }
  })
    .then((singlePage)=>{
      if(singlePage === null){
        return next(new Error('That page is not found'));
      }
      //needs to be nested, DB query, not to be chained to part of Page.find query
      singlePage.getAuthor() //async because you query the DB
        .then((retreivedAuthor)=>{
          singlePage.author = retreivedAuthor;
          // console.log(req.body);
          // console.log(singlePage);
          res.render('wikipage',{
            page : singlePage
          })
        })

    })
    .catch(next); //same as (err)=>{ next(err) }

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


