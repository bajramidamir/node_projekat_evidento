const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.get('/', (req, res) => {
    res.render('loginSignup');
});
router.post('/login', userController.loginUser)
module.exports = router;