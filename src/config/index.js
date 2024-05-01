const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('../model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
const router = require('../routes');

/*api calls will be routed from here*/
app.use('/', router);

module.exports = app;
