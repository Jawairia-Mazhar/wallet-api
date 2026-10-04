const express = require('express');
const router = express.Router();
const { createAccount, getMyAccount, transfer, deposit , getMyTransactions} = require('../controllers/accountController');
const authenticate = require('../middleware/auth');

router.post('/', authenticate, createAccount);
router.get('/me', authenticate, getMyAccount);
router.post('/transfer', authenticate, transfer);
router.post('/deposit', authenticate, deposit);
router.get('/transactions', authenticate, getMyTransactions);
module.exports = router;