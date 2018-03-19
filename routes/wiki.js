'use strict'

const express = require('express');
const router = require('./index.js');
const Page = require('../models').Page; //used methods on Page to manipulate tables
const User = require('../models').User;
module.exports = router;

// GET /wiki that comes from app.js
router.get('/', (req,res,next)=>{
  // res.render('../views/wikipage.html') //do not need to specify this path because of nunjucks.configure('views', {noCache: true})
  console.log('im here in index')
  // res.render('index')
  // res.redirect('/wiki');
  Page.findAll({})
  .then(allPages =>{
    res.render('index', {
      page: allPages
    })
  })
  .then(next); //only possible because you've defined next as a parameter
})

// POST /wiki
router.post('/', (req,res,next)=>{
  // let { name, email, title, content, status } = req.body; //ES6 deconstruction
  // console.log(name, email, title, content, status) //instead of using all this, you can Page.build(req.body)
  let page = Page.build(req.body) //sequelize will do some magic here to assign values

  page.save()
  .then(savedPage =>{
    // res.json(req.body);
    console.log('Page was saved successfully');
    res.redirect(savedPage.route);
  })
  .catch((err)=>{
    next(err);
  })
})

// GET /wiki/add
router.get('/add', (req,res,next)=>{
  res.render('addpage');
})

// GET /wiki/articleTitle
// router.get('/:urlTitle', (req,res,next)=>{
//   Page.findOne({
//     where: {
//       urlTitle: req.params.urlTitle
//     }
//   })
//   .then((foundPage)=>{ //will get back array of pages even if there's 1 page
//     // console.log(foundPage);
//     if(foundPage === null){
//       throw next(new Error('That page was not found'));
//     }
//     res.render('wikipage', {page: foundPage});
//   })
//   .catch((err)=>{
//     next(err);
//   })

// })
