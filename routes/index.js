'use strict'

const express = require('express');
const router = express.Router();

module.exports = router;

router.use('/wiki', require('./wiki.js'));
// When you're using router files, until you reach the final routes file, you are using middle-ware so you should be using `.use` . Its not until you reach the final routes file to start using RESTFUL routing verbs like `.get` | `.post` | `.put` | `.delete`
