/*
all apis will be visible here 
*/
const express = require('express');
const { getContractById, getAllNonTerminatedContracts } = require('../controllers/contract');
const { getUnpaidJobs } = require('../controllers/job');
const { getProfile } = require('../middleware/getProfile');
const router = express.Router();

router.get('/contracts',getProfile, getAllNonTerminatedContracts);
router.get('/contracts/:id',getProfile, getContractById);
router.get('/unpaid', getProfile, getUnpaidJobs);


module.exports = router;