const express = require('express');
const router = express.Router();
const { createAccount, getMyAccount, transfer } = require('../controllers/accountController');
const authenticate = require('../middleware/auth');

router.post('/', authenticate, createAccount);
router.get('/me', authenticate, getMyAccount);
router.post('/transfer', authenticate, transfer);
module.exports = router;