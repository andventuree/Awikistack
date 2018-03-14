const express = require('express');
const router = express.Router();
module.exports = router;

//dont need /wiki because the middle-ware on app.js already applies it

// /wiki/
router.get('/', (req,res,next)=>{

});

// /wiki/
router.post('/', (req,res,next)=>{

});

// /wiki/add
router.get('/add', (req,res,next)=>{
  res.render('addpage')
})
