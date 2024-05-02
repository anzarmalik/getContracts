/*
all apis will be visible here 
*/
const express = require('express');
const { getContractById, getAllNonTerminatedContracts } = require('../controllers/contract');
const { getUnpaidJobs, payForJob } = require('../controllers/job');
const { deposit } = require('../controllers/client');
const { getProfile } = require('../middleware/getProfile');
const router = express.Router();

router.get('/contracts', getProfile, getAllNonTerminatedContracts);
router.get('/contracts/:id', getProfile, getContractById);
router.get('/jobs/unpaid', getProfile, getUnpaidJobs);
router.post('/jobs/:job_id/pay', getProfile, payForJob);
router.post('/deposit/:userId', deposit);

module.exports = router;