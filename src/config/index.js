const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('../model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
import router from '../routes';

/*api calls will be routed from here*/
app.use('/deel/', router);

module.exports = app;
