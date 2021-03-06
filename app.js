const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const path = require('path');
const pg = require('pg');
const sequelize = require('sequelize');
const models = require('./models');
const Page = models.Page;
const User = models.User;
const db = models.db;
const wikiRoutes = require('./routes/wiki.js');
const userRoutes = require('./routes/users.js')

//logging middle-ware
app.use(morgan('dev'));

// app.use(express.static(__dirname + '/node_modules')); //sometimes you dont want to make dependencies public
// console.log(__dirname + '/public');
app.use(express.static(__dirname + '/public')); //doesnt seem to serve static files, check chrome sources

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

nunjucks.configure('views', {noCache: true }) // point nunjucks to the proper directory for templates
// no cache means dont store any of these file, rather, just get from file system
app.set('view engine', 'html'); //tell res.render it will work with html files
app.engine('html', nunjucks.render); //when giving html files to res.render, tell it to use nunjucks


app.use('/wiki', wikiRoutes); //will route to to wiki.js routes, prepends /wiki to all those routes
app.use('/users', userRoutes);

app.get('/', (req,res,next)=>{
  res.render('index');
});

//express logging middle-ware
app.use((err,req,res,next)=>{
  console.log(err);
  res.status(500).send(err.message);
})

// User.sync() //user table synced
//   .then(function(){
//     return Page.sync(); //then page table syncs
//   })
//   .then(function(){
//     app.listen(4000, ()=>{ console.log('server 4000 started')}) //only after syncing db, do you start server
//   });

db.sync() //syncs both tables at once! // add {force:true} in parens to drop tables!
.then(()=>{
  console.log('tables sycned');
})
.then(function(){
  app.listen(4000, ()=>{ console.log('server 4000 started')}) //only after syncing db, do you start server
});




