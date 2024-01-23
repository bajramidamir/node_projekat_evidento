const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', (req, res) => {
    const errorMessage = "";
    res.render('loginSignup', { errorMessage } );
});
router.post('/login', userController.loginUser)

module.exports = router;