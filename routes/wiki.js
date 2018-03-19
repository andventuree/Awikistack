'use strict'

const express = require('express');
const router = require('./index.js');
const Page = require('../models').Page;
const User = require('../models').User;
module.exports = router;

// GET /wiki that comes from app.js
router.get('/', (req,res,next)=>{
  // res.render('../views/wikipage.html') //do not need to specify this path because of nunjucks.configure('views', {noCache: true})
  // res.render('wikipage')
  res.redirect('/');
})

// POST /wiki
router.post('/', (req,res,next)=>{
  // let { name, email, title, content, status } = req.body; //ES6 deconstruction
  // console.log(name, email, title, content, status) //instead of using all this, you can Page.build(req.body)
  // let page = Page.build(
  //   // title: title,
  //   // content: content,
  //   // status: status
  //   req.body
  // )

  // page.save()
  // .then(savedPaged =>{
  //   res.json(req.body);
  //   // res.redirect('/');
  // })
})

// GET /wiki/add
router.get('/add', (req,res,next)=>{
  res.render('addpage');
})
