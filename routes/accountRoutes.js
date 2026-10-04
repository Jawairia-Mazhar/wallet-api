const express = require('express');
const router = express.Router();
const { createAccount, getMyAccount, transfer, deposit , getMyTransactions} = require('../controllers/accountController');
const authenticate = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

router.post('/', authenticate, createAccount);
router.get('/me', authenticate, getMyAccount);
router.post(
  '/transfer',
  authenticate,
  [
    body('fromAccountId').isInt().withMessage('fromAccountId must be a number'),
    body('toAccountId').isInt().withMessage('toAccountId must be a number'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  ],
  transfer
);
router.post(
  '/deposit',
  authenticate,
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  ],
  deposit
);
router.get('/transactions', authenticate, getMyTransactions);
module.exports = router;