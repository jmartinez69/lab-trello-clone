const express = require('express');
const path = require('path');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = (app) => {
  app.use('/api/list', require('../api/list'));
  app.use('/api/card', require('../api/card'));

  // catch 404 and forward to Angular
  app.all('/*', (req, res) => {
    res.sendfile(__dirname + '/public/index.html');
  });
};
