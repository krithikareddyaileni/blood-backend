const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

router.post('/register', donorController.registerDonor);
router.post('/donated', donorController.markDonated);

module.exports = router;