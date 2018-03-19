'use strict'

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const pg = require('pg');
const sequelize = require('sequelize');
const models = require('./models');
const routes = require('./routes');

//logging middle-ware
app.use(morgan('dev'));

//bodyParsing for incoming string information from broswer
app.use(bodyParser.urlencoded({extended: true})) //parsing string from browser
app.use(bodyParser.json()) //in case info is sent in json form

//templating middle-ware
nunjucks.configure('views',{noCache: true}); //tell nunjucks where the templates are stored
  //specifying where these template so you dont need to specify for res.render() in router files
app.set('view engine', 'html'); //tell nunjucks what type the files are
app.engine('html', nunjucks.render);//tell express to use nunjucks' res.render function

//a) serving static files
console.log('Static files path: ' + __dirname + '/public')
app.use(express.static(__dirname + '/public'));

//b) other way to serve static files
// const path = require('path');
// app.use(express.static(path.join(__dirname, '/public')))


// //first routing path
app.get('/', (req,res,next)=>{
  res.render('index');
})

//routing paths going out to each router
app.use('/', routes);

//express logging middle-ware
app.use((err,req,res,next)=>{
  console.log(err.stack);
  res.status(err.status|| 500).send(err);
})


models.db.sync( ) //{force: true}
.then(()=>{
  console.log('wikistack database is connected')
})
.then(()=>{
  app.listen(2000, () =>{ console.log(`starting server 2000`)});
})
.catch(console.error.bind(console)
  // (err)=>{ //alternative error handling
  // next(err);
// }
);

// models.Page.sync() //this would also work
// .then(()=>{
//   models.User.sync() //but would sync each table 1 by 1
// })
