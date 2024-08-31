const express = require('express');
const statusController = require('../controllers/statusController');

const router = express.Router();

router.get('/status/:requestId', statusController.checkStatus);

module.exports = router;      