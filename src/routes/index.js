/*
all apis will be visible here 
*/
const express = require('express');
const { getContractById, getAllNonTerminatedContracts } = require('../controllers/contracts');
const { getProfile } = require('../middleware/getProfile');
const router = express.Router();

router.get('/contracts',getProfile, getAllNonTerminatedContracts);
router.get('/contracts/:id',getProfile, getContractById);


module.exports = router;