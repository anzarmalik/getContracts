/*
all apis will be visible here 
*/
import express from 'express';
import { getContractById } from '../controllers';

const router = express.Router();

router.get('/contracts/:id', getProfile, getContractById);

export default router;
