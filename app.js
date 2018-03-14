const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const pg = require('pg');
const sequelize = require('sequelize');
const models = require('./models');
const Page = models.Page;
const User = models.User;
const wikiRoutes = require('./routes/wiki.js');

//logging middle-ware
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// app.use(express.static(__dirname + '/node_modules')); //sometimes you dont want to make dependencies public
app.use(express.static(__dirname + '/public'));

nunjucks.configure('views', {noCache: true }) // point nunjucks to the proper directory for templates
// no cache means dont store any of these file, rather, just get from file system
app.set('view engine', 'html'); //tell res.render it will work with html files
app.engine('html', nunjucks.render); //when giving html files to res.render, tell it to use nunjucks

app.use('/wiki', wikiRoutes); //will route to to wiki.js routes, prepends /wiki to all those routes

app.get('/', (req,res,next)=>{
  res.render('index');
});

User.sync() //user table synced
  .then(function(){
    return Page.sync(); //then page table syncs
  })
  .then(function(){
    app.listen(4000, ()=>{ console.log('server 4000 started')}) //only after syncing db, do you start server
  });


