/*
all apis will be visible here 
*/
const express = require('express');
const { getContractById } = require('../controllers');
const { getProfile } = require('../middleware/getProfile');
const router = express.Router();

router.get('/contracts/:id', getProfile, getContractById);

module.exports = router;