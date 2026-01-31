import express from 'express';
import { getTransactions, createTransaction } from '../Controller/transactionController.js';
import { authenticate } from '../Middleware/middleware.js';

const router = express.Router();

router.get('/', authenticate, getTransactions);
router.post('/', authenticate, createTransaction); // Optional: for testing creation

export default router;
