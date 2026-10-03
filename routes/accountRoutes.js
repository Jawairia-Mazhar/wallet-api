const express = require('express');
const router = express.Router();
const { createAccount } = require('../controllers/accountController');
const authenticate = require('../middleware/auth');

router.post('/', authenticate, createAccount);

module.exports = router;