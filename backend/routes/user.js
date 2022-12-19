const express = require('express');
const router = express.Router();

// On importe le contrôleur
const userCtrl = require('../controllers/user');

// On enregistre les routes user
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;