const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel');

router.get('/', ensureAuthenticated, ensureEmployee, (req, res) => {
    res.render("employeeDashboard", { user: req.user });
});

router.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
})


// helper functions
function ensureAuthenticated(req, res, next) {
    const userCookie = req.cookies.user;
    if (userCookie) {
        req.user = JSON.parse(userCookie);
        return next();
    }
    res.status(401).send("Unauthorized");
};

function ensureEmployee(req, res, next) {
    if (req.user.role === 'employee') {
        return next();
    };

    res.status(403).send("Permission denied");
};


module.exports = router;